import styles from './App.module.css'
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { SocialLayout, ThemeSupa, ViewType } from '@supabase/auth-ui-shared'
import { Auth } from '@supabase/auth-ui-react'
import { useEffect, useState } from 'react'
import ToggleButton from './ToggleButton'
import MenuIcon from './MenuIcon'
import { Input } from './Input'
import { Label } from './Label'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection,
} from "streamlit-component-lib";

const classes: { [key: string]: string } = {
  'rgb(202, 37, 37)': styles['container-redshadow'],
  'rgb(65, 163, 35)': styles['container-greenshadow'],
  'rgb(8, 107, 177)': styles['container-blueshadow'],
  'rgb(235, 115, 29)': styles['container-orangeshadow'],
  'rgb(64, 224, 208)': styles['container-turquoiseshadow'],
}

const colors = [
  'rgb(202, 37, 37)',
  'rgb(65, 163, 35)',
  'rgb(8, 107, 177)',
  'rgb(235, 115, 29)',
  'rgb(64, 224, 208)',
] as const

const socialAlignments = ['horizontal', 'vertical'] as const

const radii = ['5px', '10px', '20px'] as const

const views: { id: ViewType; title: string }[] = [
  { id: 'sign_in', title: 'Sign In' },
  { id: 'sign_up', title: 'Sign Up' },
  { id: 'magic_link', title: 'Magic Link' },
  { id: 'forgotten_password', title: 'Forgotten Password' },
  { id: 'update_password', title: 'Update Password' },
  { id: 'verify_otp', title: 'Verify Otp' },
]

const handleAuthEvent = (event: AuthChangeEvent, session: Session | null) => {
  switch (event) {
    case "SIGNED_IN":
    case "SIGNED_OUT":
      // Duplicate logout events happens under multitab
      // console.info(event, session);
      Streamlit.setComponentValue(session);
      Streamlit.setComponentReady();
      break;
    default:
  }
};

function App(props: ComponentProps) {
  const { appName, url, apiKey, providers, mode, desc, rightTitle, rightDesc, rightFooter } = props.args;
  const [supabase, setSupabase] = useState<SupabaseClient>(() =>
    createClient(url, apiKey)
  );

  useEffect(() => {
    const fetchUser = async () => {
      console.log("supabase", supabase)
      const { data, error } = await supabase.auth.getSession();
      Streamlit.setComponentValue(data?.session);
      Streamlit.setComponentReady();
      console.log("data ready", data?.session)
    }
    if (mode === "login") {
      fetchUser();
    }
    Streamlit.setFrameHeight()
  }, []);

  useEffect(() => {
    if (supabase["supabaseUrl"] !== url || supabase["supabaseKey"] !== apiKey) {
      const client = createClient(url, apiKey);
      setSupabase(client);
    }
  }, [supabase, url, apiKey]);

  // Subscribe to auth events for each new client
  useEffect(() => {
    // console.info("Adding auth change listener");
    const {data} = supabase.auth.onAuthStateChange(handleAuthEvent);
    if (data.subscription) {
      return () => data.subscription.unsubscribe();
    }
  }, [supabase]);

  const [brandColor, setBrandColor] = useState(colors[2] as string)
  const [borderRadius, setBorderRadius] = useState(radii[0] as string)
  const [theme, setTheme] = useState('dark')
  const [socialLayout, setSocialLayout] = useState<SocialLayout>(socialAlignments[1] satisfies SocialLayout)
  const [view, setView] = useState(views[0])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  const appearance = {
    theme: ThemeSupa,
    style: {
      button: {
        borderRadius: borderRadius,
        borderColor: 'rgba(0,0,0,0)',
      }
    },
    variables: {
      default: {
        colors: {
          brand: brandColor,
          brandAccent: `gray`,
        },
      },
    },
  }
  console.log("firstName", firstName)
  console.log("lastName", lastName)
  console.log("phone", phone)
  const signInComponent = (
    <div className="dark:bg-scale-200 bg-scale-100 relative py-2 pb-16">
      <div className="sm:py-18 gap container relative mx-auto grid grid-cols-12 px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
        <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
          <div className="relative lg:mx-auto lg:max-w-md bg-zinc-900">
            <div className={classes[brandColor]}>
              <div className="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-12 drop-shadow-sm">
                <div className="mb-6 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-scale-1200 text-2xl">
                      {appName}
                    </h1>
                  </div>
                  <p className="text-scale-1100 text-auth-widget-test">
                    {desc}
                  </p>
                </div>
                <Auth
                  supabaseClient={supabase}
                  view={view.id}
                  appearance={appearance}
                  providers={providers}
                  socialLayout={socialLayout}
                  theme={theme}
                  additionalData={{
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                  }}
                >
                  
                </Auth>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-span-6">
          <div className="!max-w-md">
            <h3 className="text-2xl mb-8">{rightTitle}</h3>
             <Markdown remarkPlugins={[remarkGfm]}>{rightDesc}</Markdown>
            <div className="mb-4 pt-6 flex items-center space-x-2">
              <small>{rightFooter}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const signOutComponent = (
    <button 
    className={`p-2 rounded-lg border-[1px] hover:border-blue-300 hover:text-blue-300 ring-scale-400 border-scale-800  drop-shadow-lg`} onClick={() => {
      console.log("clicked")
      supabase.auth.signOut().then(() => {
        console.log("signed out")
        Streamlit.setComponentValue({"loggedOut": true});
        Streamlit.setComponentReady();
      })
    }}>
      Sign out
    </button>
  );

  return mode === "login" ? signInComponent : signOutComponent
}

export default withStreamlitConnection(App);
