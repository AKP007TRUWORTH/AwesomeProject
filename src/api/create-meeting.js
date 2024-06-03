export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlYTVkNjMwMC1jYTA3LTRlNzctYjY3Ni03MGVlZTUzNjIzNWMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNzQxMjU2MywiZXhwIjoxNzE4MDE3MzYzfQ.v9b2TtYGEt3tL_LhFG8vq6OQu88Ux2TdinkHKU8cjeA";
// API call to create meeting
export const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    const { roomId } = await res.json();
    return roomId;
};