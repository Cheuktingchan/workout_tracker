import "../styles/globals.css";
import type { AppProps } from "next/app";
import { supabaseUtil } from "../utils/supabaseUtil";
import { useEffect, useState } from "react";
import {
    SessionContextProvider,
    useSession,
} from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
    const [supabase] = useState(() => createBrowserSupabaseClient());

    return (
        <>
            <SessionContextProvider
                supabaseClient={supabase}
                initialSession={pageProps.initialSession}
            >
                <Component {...pageProps} />
            </SessionContextProvider>
        </>
    );
}
