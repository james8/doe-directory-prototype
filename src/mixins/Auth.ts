// tslint:disable: one-line comment-format curly

// @ts-ignore
import AuthenticationContext from "@/../node_modules/adal-angular/lib/adal.js";

// Not sure if needs to be private?
const config: any = {
    tenant: "e2879f29-7f5e-457a-9267-3b9c40a59868",
    clientId: "537395c1-3092-43df-923e-7e2f611b9d55",
    redirectUri: "http://localhost:8080",
    cacheLocation: "localStorage",
    endpoints: "https://graph.microsoft.com"
};
const authenticationContext: any = new AuthenticationContext(config);

if (authenticationContext.isCallback(window.location.hash) || window.self !== window.top) {
    // redirect to the location specified in the url params.
    authenticationContext.handleWindowCallback();
}
else {
    // try pull the user out of local storage
    let user:any = authenticationContext.getCachedUser();
    console.log(user);
    // if (!user) authenticationContext.login();
}

const authMixin: any = {
    // initialize: (() => {}),
    // created: (() => {}),

    methods: {
        Auth_Login: (() => authenticationContext.login()),

        Auth_Logout: (() => authenticationContext.logOut()),

        Auth_IsAuthenticated: (() => {
            return authenticationContext.getCachedToken(config.clientId) ? true : false;
        }),

        // GET default ADAL.js User object (doesn't return much useful info)
        Auth_GetUserProfile: (() => authenticationContext.getCachedUser().profile),

        // GET extended User object (uses the 'beta' api call)
        Auth_GetUserProfileExtended: ((token: string) => {
            return new Promise((resolve, reject) => {
                fetch ("https://graph.microsoft.com/beta/me/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                        "content-type": "application/json"
                    }
                })
                .then(response => resolve(response.json()))
                .catch(error => reject(error));
            });
        }),

        Auth_AcquireMSGraphToken: (() => {
            return new Promise((resolve, reject) => {
                const hash: string = window.location.hash;
                if (hash !== "") authenticationContext.handleWindowCallback(hash);
                authenticationContext.getCachedUser();

                authenticationContext.acquireToken("https://graph.microsoft.com", ((error: Error, token: string) => {
                    if (error || !token) return reject(error);
                    else return resolve(token);
                }));
            });
        }),

        // Not sure what this method is used for
        Auth_AcquireTokenRedirect: (() => authenticationContext.acquireTokenRedirect("https://graph.microsoft.com"))
    }
};

export default authMixin;
