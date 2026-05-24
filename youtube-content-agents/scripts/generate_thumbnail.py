#!/usr/bin/env python3
"""
Thumbnail Generator — OpenAI GPT Image 2

Uses gpt-image-2 on /images/edits for native 1280x720 (16:9) thumbnail
generation with reference images. No cropping needed.

Usage:
    python3 generate_thumbnail.py <prompt> <title_slug> <output_filename> \
        <image_path_1> [image_path_2] ...

The first image path is always the SUBJECT (e.g. resources/subject.png).
Any subsequent image paths are LOGOS (e.g. resources/app-logos/n8n-logo.png).

Optional environment overrides (all have sensible defaults, so the command
can feed values straight from config.json without editing this file):
    OPENAI_API_KEY        required — your OpenAI key (also read from .env)
    THUMBNAIL_OUTPUT_DIR  base output directory      (default: "thumbnails")
    THUMBNAIL_MODEL       image model                (default: "gpt-image-2")
    THUMBNAIL_SIZE        output size                (default: "1280x720")
    THUMBNAIL_QUALITY     quality: low|medium|high   (default: "high")
    THUMBNAIL_FORMAT      output format              (default: "png")
"""
import os
import sys
import base64
import ssl
from pathlib import Path
import subprocess

try:
    import requests
except ImportError:
    print("Installing missing dependency (requests)...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        import requests
    except Exception as e:
        print(f"Failed to install dependencies: {e}")
        sys.exit(1)

ssl._create_default_https_context = ssl._create_unverified_context


def load_env():
    env_path = Path(".env")
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    try:
                        key, value = line.split("=", 1)
                        os.environ.setdefault(key, value)
                    except ValueError:
                        pass


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def generate_thumbnail(prompt, title_slug, output_filename, image_paths):
    load_env()
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key or api_key == "your_key_here":
        print("Error: OPENAI_API_KEY not found (or still a placeholder) in .env or environment")
        sys.exit(1)

    if not image_paths:
        print("Error: No input images provided.")
        sys.exit(1)

    output_base = os.getenv("THUMBNAIL_OUTPUT_DIR", "thumbnails")
    model = os.getenv("THUMBNAIL_MODEL", "gpt-image-2")
    size = os.getenv("THUMBNAIL_SIZE", "1280x720")
    quality = os.getenv("THUMBNAIL_QUALITY", "high")
    output_format = os.getenv("THUMBNAIL_FORMAT", "png")

    url = "https://api.openai.com/v1/images/edits"

    print(f"Generating thumbnail using {model} on /images/edits (JSON mode)...")
    print(f"Prompt: {prompt[:100]}...")
    print(f"Input Images: {', '.join(image_paths)}")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    images_payload = []
    for path in image_paths:
        if not os.path.exists(path):
            print(f"Error: Image not found at {path}")
            sys.exit(1)
        base64_data = encode_image(path)
        images_payload.append({"image_url": f"data:image/png;base64,{base64_data}"})

    payload = {
        "model": model,
        "prompt": prompt,
        "images": images_payload,
        "size": size,
        "quality": quality,
        "output_format": output_format,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)

        if response.status_code != 200:
            print(f"API Error: {response.status_code} - {response.text}")
            sys.exit(1)

        result = response.json()

        image_data = None
        if "data" in result and len(result["data"]) > 0:
            item = result["data"][0]
            if "b64_json" in item:
                image_data = base64.b64decode(item["b64_json"])
            elif "url" in item:
                image_data = requests.get(item["url"]).content

        if not image_data:
            print(f"No image data found. keys: {result.keys()}")
            sys.exit(1)

        output_path = Path(output_base) / title_slug / output_filename
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "wb") as f:
            f.write(image_data)

        print(f"Thumbnail saved to: {output_path} (native {size}, no crop)")
        return str(output_path)

    except Exception as e:
        print(f"Error generating image: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(
            "Usage: python generate_thumbnail.py <prompt> <title_slug> <output_filename> <image_path_1> [image_path_2] ..."
        )
        sys.exit(1)

    prompt = sys.argv[1]
    title_slug = sys.argv[2]
    filename = sys.argv[3]
    image_paths = sys.argv[4:]

    generate_thumbnail(prompt, title_slug, filename, image_paths)
