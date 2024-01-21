//COVERAGE_TAG: GET /booking/
//COVERAGE_TAG: GET /booking/{id}
//COVERAGE_TAG: GET /booking/summary

import { test, expect } from "@fixtures/fixtures";
import { createHeaders, createInvalidHeaders } from "@helpers/createHeaders";
// import { isValidDate } from "../../lib/helpers/date";

test.describe("booking/ GET requests", async () => {
    let headers;
    let invalidHeader;

    test.beforeAll(async ({ request }) => {
        headers = await createHeaders();
        invalidHeader = await createInvalidHeaders();
    });


    test("GET booking summary with specific room id @happy", async ({ request }) => {
        const response = await request.get("booking/summary?roomid=1");

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.bookings.length).toBeGreaterThanOrEqual(1);

        expect(body.bookings[0].bookingDates.checkin).toBeValidDate();
        expect(body.bookings[0].bookingDates.checkout).toBeValidDate();
    });

    test("GET booking summary with specific room id that doesn't exist", async ({
        request,
    }) => {
        const response = await request.get("booking/summary?roomid=999999");

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.bookings.length).toBe(0);
    });

    test("GET booking summary with specific room id that is empty", async ({
        request,
    }) => {
        const response = await request.get("booking/summary?roomid=");

        expect(response.status()).toBe(500);

        const body = await response.json();
        expect(body.timestamp).toBeValidDate();
        expect(body.status).toBe(500);
        expect(body.error).toBe("Internal Server Error");
        expect(body.path).toBe("/booking/summary");
    });

    test("GET all bookings with details @happy", async ({ request }) => {
        const response = await request.get("booking/", {
            headers: headers,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.bookings.length).toBeGreaterThanOrEqual(1);
        expect(body.bookings[0].bookingid).toBe(1);
        expect(body.bookings[0].roomid).toBe(1);
        expect(body.bookings[0].firstname).toBe("James");
        expect(body.bookings[0].lastname).toBe("Dean");
        expect(body.bookings[0].depositpaid).toBe(true);
        expect(body.bookings[0].bookingdates.checkin).toBeValidDate();
        expect(body.bookings[0].bookingdates.checkout).toBeValidDate();
    });

    test("GET all bookings with details with no authentication", async ({ request }) => {
        const response = await request.get("booking/", {
            headers: invalidHeader,
        });

        expect(response.status()).toBe(403);

        const body = await response.text();
        expect(body).toBe("");
    });

    test("GET booking by id with details", async ({ request }) => {
        const response = await request.get("booking/1", {
            headers: headers,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.bookingid).toBe(1);
        expect(body.roomid).toBe(1);
        expect(body.firstname).toBe("James");
        expect(body.lastname).toBe("Dean");
        expect(body.depositpaid).toBe(true);
        expect(body.bookingdates.checkin).toBeValidDate();
        expect(body.bookingdates.checkout).toBeValidDate();
    });

    test("GET booking by id that doesn't exist", async ({ request }) => {
        const response = await request.get("booking/999999", {
            headers: headers,
        });

        expect(response.status()).toBe(404);

        const body = await response.text();
        expect(body).toBe("");
    });

    test("GET booking by id without authentication", async ({ request }) => {
        const response = await request.get("booking/1");

        expect(response.status()).toBe(403);

        const body = await response.text();
        expect(body).toBe("");
    });
});
