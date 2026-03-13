#!/usr/bin/env python3
"""
Shard a large JSONL file into smaller JSON array files plus an index file.

Input:
  data.jsonl
    one JSON object per line, each like:
    {"title": "...", "selftext": "..."}

Output:
  output_dir/
    index.json
    shards/
      posts-000001.json
      posts-000002.json
      ...

Usage:
  python shard_jsonl.py data.jsonl output_dir --records-per-shard 2000

Recommended:
  Start with records-per-shard around 1000-5000 and adjust based on average post size.
"""

from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Split a JSONL file into shard JSON files and create an index.json."
    )
    parser.add_argument(
        "input_file",
        type=Path,
        help="Path to the source JSONL file",
    )
    parser.add_argument(
        "output_dir",
        type=Path,
        help="Directory where index.json and shard files will be written",
    )
    parser.add_argument(
        "--records-per-shard",
        type=int,
        default=2000,
        help="Maximum number of records per shard file (default: 2000)",
    )
    parser.add_argument(
        "--prefix",
        type=str,
        default="posts",
        help="Shard filename prefix (default: posts)",
    )
    parser.add_argument(
        "--indent",
        type=int,
        default=None,
        help="Pretty-print JSON with this indent level. Default is compact JSON.",
    )
    parser.add_argument(
        "--skip-invalid",
        action="store_true",
        help="Skip invalid JSON lines instead of failing",
    )
    parser.add_argument(
        "--require-fields",
        action="store_true",
        help="Only keep records that contain string fields 'title' and 'selftext'",
    )
    return parser.parse_args()


def ensure_dirs(output_dir: Path) -> Path:
    shards_dir = output_dir / "shards"
    shards_dir.mkdir(parents=True, exist_ok=True)
    return shards_dir


def validate_record(record: Any, require_fields: bool) -> bool:
    if not isinstance(record, dict):
        return False
    if not require_fields:
        return True
    return (
        isinstance(record.get("title"), str)
        and isinstance(record.get("selftext"), str)
    )


def write_shard(
    shard_records: list[dict[str, Any]],
    shard_number: int,
    prefix: str,
    shards_dir: Path,
    indent: int | None,
) -> dict[str, Any]:
    filename = f"{prefix}-{shard_number:06d}.json"
    filepath = shards_dir / filename

    with filepath.open("w", encoding="utf-8") as f:
        json.dump(
            shard_records,
            f,
            ensure_ascii=False,
            indent=indent,
            separators=None if indent is not None else (",", ":"),
        )

    size_bytes = filepath.stat().st_size

    return {
        "file": f"shards/{filename}",
        "count": len(shard_records),
        "size_bytes": size_bytes,
        "shard_number": shard_number,
    }


def shard_jsonl(
    input_file: Path,
    output_dir: Path,
    records_per_shard: int,
    prefix: str,
    indent: int | None,
    skip_invalid: bool,
    require_fields: bool,
) -> None:
    if records_per_shard <= 0:
        raise ValueError("--records-per-shard must be > 0")

    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")

    shards_dir = ensure_dirs(output_dir)

    total_lines = 0
    total_valid_records = 0
    total_invalid_lines = 0
    shard_number = 1
    shard_records: list[dict[str, Any]] = []
    shard_meta: list[dict[str, Any]] = []

    with input_file.open("r", encoding="utf-8-sig", newline="") as f:
        for line_number, raw_line in enumerate(f, start=1):
            total_lines += 1
            line = raw_line.strip()

            if not line:
                continue

            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                if skip_invalid:
                    total_invalid_lines += 1
                    print(f"[WARN] Skipping invalid JSON on line {line_number}: {exc}")
                    continue
                raise ValueError(f"Invalid JSON on line {line_number}: {exc}") from exc

            if not validate_record(record, require_fields=require_fields):
                if skip_invalid:
                    total_invalid_lines += 1
                    print(f"[WARN] Skipping invalid record shape on line {line_number}")
                    continue
                raise ValueError(
                    f"Invalid record shape on line {line_number}. "
                    f"Expected object{'' if not require_fields else ' with string title/selftext'}."
                )

            shard_records.append(record)
            total_valid_records += 1

            if len(shard_records) >= records_per_shard:
                meta = write_shard(
                    shard_records=shard_records,
                    shard_number=shard_number,
                    prefix=prefix,
                    shards_dir=shards_dir,
                    indent=indent,
                )
                shard_meta.append(meta)
                print(
                    f"[OK] Wrote {meta['file']} "
                    f"({meta['count']} records, {meta['size_bytes']} bytes)"
                )
                shard_number += 1
                shard_records = []

    if shard_records:
        meta = write_shard(
            shard_records=shard_records,
            shard_number=shard_number,
            prefix=prefix,
            shards_dir=shards_dir,
            indent=indent,
        )
        shard_meta.append(meta)
        print(
            f"[OK] Wrote {meta['file']} "
            f"({meta['count']} records, {meta['size_bytes']} bytes)"
        )

    total_shards = len(shard_meta)
    total_size_bytes = sum(item["size_bytes"] for item in shard_meta)

    index = {
        "version": 1,
        "source_file": input_file.name,
        "total_lines_read": total_lines,
        "total_records": total_valid_records,
        "invalid_lines_skipped": total_invalid_lines,
        "records_per_shard": records_per_shard,
        "total_shards": total_shards,
        "total_size_bytes": total_size_bytes,
        "shards": shard_meta,
    }

    index_path = output_dir / "index.json"
    with index_path.open("w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    avg_shard_size = total_size_bytes / total_shards if total_shards else 0

    print()
    print("[DONE]")
    print(f"Index file: {index_path}")
    print(f"Total records: {total_valid_records}")
    print(f"Total shards: {total_shards}")
    print(f"Total shard bytes: {total_size_bytes}")
    print(f"Average shard size: {math.floor(avg_shard_size)} bytes")


def main() -> None:
    args = parse_args()
    shard_jsonl(
        input_file=args.input_file,
        output_dir=args.output_dir,
        records_per_shard=args.records_per_shard,
        prefix=args.prefix,
        indent=args.indent,
        skip_invalid=args.skip_invalid,
        require_fields=args.require_fields,
    )


if __name__ == "__main__":
    main()