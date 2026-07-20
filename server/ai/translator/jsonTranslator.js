function translate(aiText) {

    if (!aiText) {

        throw new Error("Gemini returned an empty response.");

    }

    let parsed;

    try {

        parsed = JSON.parse(aiText);

    }

    catch {

        throw new Error("Gemini did not return valid JSON.");

    }

    if (!parsed.intent) {

        throw new Error("Missing intent.");

    }

    return parsed;

}

module.exports = {

    translate

};