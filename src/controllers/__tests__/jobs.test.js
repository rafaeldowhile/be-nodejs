const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

describe("Test jobs endpoints", () => {

    test("It should return one unpaid job", async () => {
        const response = await request(app).get("/jobs/unpaid").set('profile_id', 1);
        expect(response.statusCode).toBe(200);
        expect(response.body.rows).toHaveLength(1);
        expect(response.body.count).toEqual(1);

    });

    test("It should pay the job if the user has enough balance", async () => {
        const response = await request(app)
            .post("/jobs/2/pay")
            .set('profile_id', 1);

        expect(response.statusCode).toBe(200);
    });


    test("It should respond an error when trying to pay without balance.", async () => {
        const response = await request(app)
            .post("/jobs/5/pay")
            .set('profile_id', 4);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("You don't have enough credits to execute this operation.");
    });

});