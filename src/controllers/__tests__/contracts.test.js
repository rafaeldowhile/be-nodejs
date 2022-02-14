const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

describe("Test contracts endpoints", () => {

    test("It should return an error if not provided the profile_id", async () => {
        const response = await request(app).get("/contracts");
        expect(response.statusCode).toBe(401);
    });

    test("It should return the contracts from profile_id = 3", async () => {
        const response = await request(app).get("/contracts").set('profile_id', 3);
        expect(response.statusCode).toBe(200);
        expect(response.body.rows).toHaveLength(2);
        expect(response.body.count).toEqual(2);
    });

});