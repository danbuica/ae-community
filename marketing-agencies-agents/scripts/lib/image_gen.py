"""Shared image generation utility using Nano Banana 2."""

import os
import sys
from pathlib import Path


def get_genai_client():
    """Initialize and return a Gemini client."""
    try:
        from google import genai
    except ImportError:
        print("Error: google-genai not installed. Run: pip install google-genai Pillow")
        sys.exit(1)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)

    return genai.Client(api_key=api_key)


def generate_image(genai_client, prompt: str, output_path: Path) -> bool:
    """Generate a single image with Nano Banana 2 and save it."""
    try:
        response = genai_client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=[prompt],
        )
        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                image.save(str(output_path))
                return True
        for part in response.parts:
            if part.text:
                print(f"    Warning: {part.text[:150]}")
        return False
    except Exception as e:
        print(f"    Error: {e}")
        return False


def generate_text(genai_client, prompt: str) -> str:
    """Generate text with Gemini Flash."""
    response = genai_client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[prompt],
    )
    return (response.text or "").strip()
