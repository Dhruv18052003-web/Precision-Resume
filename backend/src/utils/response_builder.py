# backend/src/utils/response_builder.py

from flask import jsonify

def success_response(data: dict, status_code: int = 200):
    """
    Standard success JSON response.
    """
    return jsonify(data), status_code


def error_response(message: str, status_code: int = 400):
    """
    Standard error JSON response.
    """
    return jsonify({"error": message}), status_code
