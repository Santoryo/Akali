import { createHttp1Request, type Credentials } from "league-connect";

export async function currentPatch(credentials: Credentials): Promise<string> {
    try {
        const temp = await createHttp1Request(
            {
                method: "GET",
                url: "lol-patch/v1/game-version",
            },
            credentials
        );

        const data: string = temp.json();
        const versionParts = data.split('.');
        const majorMinorVersion = `${versionParts[0]}.${versionParts[1]}`;

        return majorMinorVersion;

    } catch (error) {
        console.warn(error);
        return "";
    }
}
