import os
from typing import Any, List, Mapping, Optional
from dotenv import load_dotenv 
import streamlit.components.v1 as components
# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = os.getenv("RELEASE", "0") == "1"
load_dotenv()
# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.
print(f"RELEASE: {_RELEASE}")
if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name
        "streamlit_auth_ui",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/dist")
    _component_func = components.declare_component("streamlit_auth_ui", path=build_dir)


def login_form(
    appName: Optional[str] = None,
    rightTitle: Optional[str] = None,
    rightDesc: Optional[str] = None,
    rightFooter: Optional[str] = None,
    desc: Optional[str] = None,
    url: Optional[str] = None,
    apiKey: Optional[str] = None,
    providers: Optional[List[str]] = None,
) -> Mapping[str, Any]:
    """Creates a new instance of `login` component using supabase-js.

    Args:
        url (Optional[str], optional): Supabase URL.
            Defaults to `SUPABASE_URL` env var.
        apiKey (Optional[str], optional): Supabase anonymous API key.
            Defaults to `SUPABASE_KEY` env var.
        providers (Optional[List[str]], optional): List of supported OAuth providers.
            Defaults to None.

    Returns:
        Mapping[str, Any]: Auth session of the logged in user.
    """
    # Arguments passed here will be sent to the frontend as "args" dictionary.
    session = _component_func(
        appName=appName or "",
        desc=desc or "",
        rightTitle=rightTitle or "",
        rightDesc=rightDesc or "",
        rightFooter=rightFooter or "",
        url=url or os.environ["SUPABASE_URL"],
        apiKey=apiKey or os.environ["SUPABASE_KEY"],
        providers=providers or [],
        mode="login",
    )
    # Modify the value returned so that it can be used as default selections.
    return session

def logout_button(url: Optional[str] = None, apiKey: Optional[str] = None) -> None:
    """Creates a new instance of `logout` component using supabase-js.

    Args:
        url (Optional[str], optional): Supabase URL.
            Defaults to `SUPABASE_URL` env var.
        apiKey (Optional[str], optional): Supabase anonymous API key.
            Defaults to `SUPABASE_KEY` env var.
    """
    session = _component_func(
        url=url or os.environ["SUPABASE_URL"],
        apiKey=apiKey or os.environ["SUPABASE_KEY"],
        mode="logout",
    )
    return session


import streamlit as st

def main():
    st.write("## Example")
    value = login_form()

    st.write(value)


if __name__ == "__main__":
    main()