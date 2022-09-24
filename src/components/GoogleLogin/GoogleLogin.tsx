import { GsiButtonConfiguration, IdConfiguration } from 'google-one-tap';
import useGoogleLogin from './useGoogleLogin';

type GOOGLELOGIN = IdConfiguration & { buttonOption?: GsiButtonConfiguration };

export default function GoogleLogin({
    client_id,
    allowed_parent_origin,
    auto_select,
    buttonOption,
    callback,
    cancel_on_tap_outside,
    context,
    intermediate_iframe_close_callback,
    login_uri,
    native_callback,
    nonce,
    prompt_parent_id,
    state_cookie_domain,
    ux_mode
}: GOOGLELOGIN) {
    const buttonId = 'google-login-btn';
    const initialize = {
        client_id,
        allowed_parent_origin,
        auto_select,
        callback,
        cancel_on_tap_outside,
        context,
        intermediate_iframe_close_callback,
        login_uri,
        native_callback,
        nonce,
        prompt_parent_id,
        state_cookie_domain,
        ux_mode
    };

    useGoogleLogin({ buttonId, initialize, buttonOption });

    return <div id={buttonId} />;
}
