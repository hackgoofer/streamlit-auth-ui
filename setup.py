import setuptools

with open("README.md", "r", encoding="utf-8") as f:
    long_description = f.read()

setuptools.setup(
    name="streamlit_auth_ui",
    version="0.0.1",
    author="Sasha Dog",
    author_email="hackgoofer@gmail.com",
    description="Thin wrapper for streamlit with Supabase auth-ui",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/hackgoofer/streamlit-auth-ui",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit >= 0.63",
    ],
)
