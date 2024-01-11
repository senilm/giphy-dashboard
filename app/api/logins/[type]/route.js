import { NextResponse } from "next/server";
import prisma from "@/app/db";

export const POST = async (req, { params }) => {
  const { type } = params;
  const {startDate, endDate} = await req.json()

  let startDateValue, endDateValue

  
  if (startDate) {
    startDateValue = new Date(startDate).toISOString()
  }else{
    startDateValue = new Date("2023-01-01T00:00:00.000Z").toISOString();
  }
  if (endDate) {
    endDateValue = new Date(endDate).toISOString()  
  }else{
    endDateValue = new Date(Date.now()).toISOString();
  }

  let loginsData;
  try {
    if (type === "daily") {
      loginsData = await prisma.login.aggregateRaw({
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $gte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: startDateValue,
                        },
                      },
                    ],
                  },
                },
                {
                  $expr: {
                    $lte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: endDateValue,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              distinctUsers: { $addToSet: "$userId" }, // Using the "userId" field for distinct users
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
              distinctUsersCount: { $size: "$distinctUsers" }, // Count the distinct users
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    } else if (type === "weekly") {
      loginsData = await prisma.login.aggregateRaw({
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $gte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: startDateValue,
                        },
                      },
                    ],
                  },
                },
                {
                  $expr: {
                    $lte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: endDateValue,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: {
                isoWeekYear: { $isoWeekYear: "$createdAt" },
                isoWeek: { $isoWeek: "$createdAt" },
              },
              distinctUsers: { $addToSet: "$userId" }, // Replace "userId" with the actual field name
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  isoWeekYear: "$_id.isoWeekYear",
                  isoWeek: "$_id.isoWeek",
                  isoDayOfWeek: 1,
                },
              },
              distinctUsersCount: { $size: "$distinctUsers" },
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    } else {
      loginsData = await prisma.login.aggregateRaw({
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $gte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: startDateValue,
                        },
                      },
                    ],
                  },
                },
                {
                  $expr: {
                    $lte: [
                      "$createdAt",
                      {
                        $dateFromString: {
                          dateString: endDateValue,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              distinctUsers: { $addToSet: "$userId" }, // Replace "userId" with the actual field name
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
              distinctUsersCount: { $size: "$distinctUsers" },
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    }
    return new Response(JSON.stringify(loginsData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 401 });
  }
};
