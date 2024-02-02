export const Endpoints = {
  auth: {
    path: "/auth",
    swaggerURL: "https://automationintesting.online/auth/v3/api-docs/auth-api",
  },
  booking: {
    path: "/booking",
    swaggerURL: "https://automationintesting.online/booking/v3/api-docs/booking-api",
  },
  room: {
    path: "/room",
    swaggerURL: "https://automationintesting.online/room/v3/api-docs/room-api",
  },
  branding: {
    path: "/branding",
    swaggerURL: "https://automationintesting.online/branding/v3/api-docs/branding-api",
  },
  report: {
    path: "/report",
    swaggerURL: "https://automationintesting.online/report/v3/api-docs/report-api",
  },
  message: {
    path: "/message",
    swaggerURL: "https://automationintesting.online/message/v3/api-docs/message-api",
  },
} as const;

export const EndpointKeys: (keyof typeof Endpoints)[] = Object.keys(Endpoints) as (keyof typeof Endpoints)[];
