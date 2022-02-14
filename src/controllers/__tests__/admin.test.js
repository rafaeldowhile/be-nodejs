const request = require("supertest");
const app = require("../../app");
const moment = require("moment");

describe("Test admin get best profession endpoint", () => {

    test("It should return an error if not provided start and end dates.", async () => {
        const response = await request(app).get("/admin/best-profession");
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Please provide the start and end dates in the following MM-DD-YYYY.")
    });

    test("It should return an error if end date < start date.", async () => {

        const requestParams = {
            start: moment().startOf('month').format('MM-DD-YYYY'),
            end: moment().startOf('month').subtract(1, 'months').format('MM-DD-YYYY')
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("The start date has to be before the end date.")
    });

    test("It should return an error if provided only start date", async () => {

        const requestParams = {
            start: moment().startOf('month').format('MM-DD-YYYY'),
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Please provide the start and end dates in the following MM-DD-YYYY.")
    });

    test("It should return Programmer as best profession between 08-01-2020 and 09-01-2020", async () => {

        const requestParams = {
            start: '08-01-2020',
            end: '09-01-2020'
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(200);
        expect(response.body.profession).toEqual("Programmer");
        expect(response.body.amount).toEqual(2683);
    });


    test("It should return Musician as best profession between 08-01-2020 and 08-13-2020", async () => {

        const requestParams = {
            start: '08-01-2020',
            end: '08-13-2020'
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(200);
        expect(response.body.profession).toEqual("Musician");
        expect(response.body.amount).toEqual(21);
    });


});


describe("Test admin get the clients that most paid jobs", () => {

    test("GET /admin/best-clients - It should return an error if not provided start and end dates.", async () => {
        const response = await request(app).get("/admin/best-clients");
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Please provide the start and end dates in the following MM-DD-YYYY.")
    });

    test("GET /admin/best-clients - It should return an error if end date < start date.", async () => {

        const requestParams = {
            start: moment().startOf('month').format('MM-DD-YYYY'),
            end: moment().startOf('month').subtract(1, 'months').format('MM-DD-YYYY')
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("The start date has to be before the end date.")
    });

    test("GET /admin/best-clients - It should return an error if provided only start date", async () => {

        const requestParams = {
            start: moment().startOf('month').format('MM-DD-YYYY'),
        }

        const response = await request(app)
            .get("/admin/best-profession")
            .query(requestParams);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Please provide the start and end dates in the following MM-DD-YYYY.")
    });

    test("GET /admin/best-clients - It should return 2 items and Ash Kethcum as the client that most paid for jobs", async () => {

        const requestParams = {
            start: '08-01-2020',
            end: '09-01-2020'
        }

        const response = await request(app)
            .get("/admin/best-clients")
            .query(requestParams);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]["fullName"]).toEqual("Ash Kethcum")
        expect(response.body[0].paid).toEqual(2020);
    });


    test("GET /admin/best-clients - It should return 1 item and Mr Robot as the client that most paid for jobs", async () => {

        const requestParams = {
            start: '08-01-2020',
            end: '08-14-2020',
            limit: 1
        }

        const response = await request(app)
            .get("/admin/best-clients")
            .query(requestParams);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]["fullName"]).toEqual("Mr Robot")
        expect(response.body[0].paid).toEqual(121);
    });


});