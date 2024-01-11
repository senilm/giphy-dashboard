import { NextResponse } from "next/server";
import prisma from "@/app/db";

export const POST = async (req, { params }) => {
  const { type } = params;
  const { startDate, endDate } = await req.json();

  let startDateValue, endDateValue;

  if (startDate) {
    startDateValue = new Date(startDate).toISOString();
  } else {
    startDateValue = new Date("2023-01-01T00:00:00.000Z").toISOString();
  }
  if (endDate) {
    endDateValue = new Date(endDate).toISOString();
  } else {
    endDateValue = new Date(Date.now()).toISOString();
  }
  let favoriteData;
  try {
    if (type === "daily") {
      favoriteData = await prisma.gifLike.aggregateRaw({
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
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    } else if (type === "weekly") {
      favoriteData = await prisma.gifLike.aggregateRaw({
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
                isoWeekYear: { $isoWeekYear: "$createdAt" }, // Use $isoWeekYear for ISO-compliant year
                isoWeek: { $isoWeek: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  isoWeekYear: "$_id.isoWeekYear", // Use extracted ISO year
                  isoWeek: "$_id.isoWeek",
                  isoDayOfWeek: 1, // Use $dayOfWeek for ISO week-based day
                },
              },
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    } else {
      favoriteData = await prisma.gifLike.aggregateRaw({
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
                  day: 1, // Set the day to 1 as you are grouping by month
                },
              },
              count: 1,
            },
          },
          {
            $sort: { date: 1 },
          },
        ],
      });
    }
    return new Response(JSON.stringify(favoriteData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }
};
