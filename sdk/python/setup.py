from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="payperagent",
    version="0.1.0",
    author="PayPerAgent",
    description="Python SDK for PayPerAgent API Gateway",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/payperagent/sdk-python",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.31.0",
        "eth-account>=0.10.0",
        "web3>=6.11.0",
    ],
)
