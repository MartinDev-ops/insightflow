import API_BASE_URL from "./config";

const STORAGE_KEY = "insightflow_visitor_token";

/**
 * Returns the signed visitor token, fetching one on first use.
 *
 * The token is issued by the server (`POST /auth/visitor`) and carries an HMAC
 * signature over the visitor id. A client-generated id could be forged or
 * guessed, letting one visitor read another visitor's projects, so identity is
 * now established server-side.
 *
 * The in-flight promise is cached so that several services mounting at once
 * (projects + workbook + export) trigger a single token request rather than
 * racing to create separate visitors.
 */
let inFlightRequest = null;

export async function getVisitorToken() {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {

        return stored;

    }

    if (!inFlightRequest) {

        inFlightRequest = fetch(`${API_BASE_URL}/auth/visitor`, {
            method: "POST"
        })
            .then((response) => {

                if (!response.ok) {

                    throw new Error("Failed to establish visitor session.");

                }

                return response.json();

            })
            .then((data) => {

                localStorage.setItem(STORAGE_KEY, data.token);

                return data.token;

            })
            .finally(() => {

                inFlightRequest = null;

            });

    }

    return inFlightRequest;

}

/**
 * Builds request headers carrying the visitor token.
 *
 * Use in place of the old `X-Visitor-Id` header. Every call site must await
 * this, which is why the service functions are already async.
 */
export async function getAuthHeaders(extraHeaders = {}) {

    const token = await getVisitorToken();

    return {
        ...extraHeaders,
        "X-Visitor-Token": token
    };

}

/**
 * Clears the cached token. Call this when the server rejects a token as
 * expired or tampered, so the next request mints a fresh one.
 */
export function clearVisitorToken() {

    localStorage.removeItem(STORAGE_KEY);

}
