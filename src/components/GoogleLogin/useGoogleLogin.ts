import { GsiButtonConfiguration, IdConfiguration } from 'google-one-tap';
import { useEffect } from 'react';

type USEGOOGLELOGIN = {
    initialize: IdConfiguration;
    buttonId: string;
    buttonOption?: GsiButtonConfiguration;
};

export default function useGoogleLogin({ initialize, buttonId, buttonOption = {} }: USEGOOGLELOGIN) {
    const id = 'use-google-login';

    useEffect(() => {
        if (document.getElementById(id)) return;    
        const script = document.createElement('script');
        script.id = id;
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            window.google.accounts.id.initialize(initialize);
            window.google.accounts.id.renderButton(document.getElementById(buttonId)!, buttonOption);
        };
        document.head.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);

    return;
}
