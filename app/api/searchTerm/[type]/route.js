import { NextResponse } from "next/server";
import prisma from "@/app/db";
// import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export const POST = async (req, { params }) => {
  const { type } = params;
  // const searchParams = useSearchParams()
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


  let searchTermData;
  try {
    if (type === "daily") {
      searchTermData = await prisma.search.aggregateRaw({
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
                day: {
                  $dayOfMonth: "$createdAt",
                },
                month: {
                  $month: "$createdAt",
                },
                year: {
                  $year: "$createdAt",
                },
                searchTermId: "$searchTermId",
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              searchTermId: "$_id.searchTermId",
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
            $sort: {
              count: -1,
            },
          },
          {
            $lookup: {
              from: "SearchTerm",
              localField: "searchTermId",
              foreignField: "_id",
              as: "SearchTermData",
            },
          },
          {
            $addFields: {
              SearchTermData: {
                $first: "$SearchTermData",
              },
            },
          },
          {
            $group: {
              _id: "$date",
              searchTerms: {
                $push: {
                  termdata: "$SearchTermData",
                  count: "$count",
                },
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ],
      });
    } else if (type === "weekly") {
      searchTermData = await prisma.search.aggregateRaw({
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
                week: {
                  $isoWeek: "$createdAt",
                },
                year: {
                  $isoWeekYear: "$createdAt",
                },
                searchTermId: "$searchTermId",
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              searchTermId: "$_id.searchTermId",
              weekStartDate: {
                $dateFromParts: {
                  isoWeekYear: "$_id.year",
                  isoWeek: "$_id.week",
                },
              },
              count: 1,
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $lookup: {
              from: "SearchTerm",
              localField: "searchTermId",
              foreignField: "_id",
              as: "SearchTermData",
            },
          },
          {
            $addFields: {
              SearchTermData: {
                $first: "$SearchTermData",
              },
            },
          },
          {
            $group: {
              _id: "$weekStartDate",
              searchTerms: {
                $push: {
                  termdata: "$SearchTermData",
                  count: "$count",
                },
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ],
      });
    } else {
      searchTermData = await prisma.search.aggregateRaw({
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
                month: {
                  $month: "$createdAt",
                },
                year: {
                  $year: "$createdAt",
                },
                searchTermId: "$searchTermId",
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              searchTermId: "$_id.searchTermId",
              monthStartDate: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1, 
                },
              },
              count: 1,
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $lookup: {
              from: "SearchTerm",
              localField: "searchTermId",
              foreignField: "_id",
              as: "SearchTermData",
            },
          },
          {
            $addFields: {
              SearchTermData: {
                $first: "$SearchTermData",
              },
            },
          },
          {
            $group: {
              _id: "$monthStartDate",
              searchTerms: {
                $push: {
                  termdata: "$SearchTermData",
                  count: "$count",
                },
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ],
      });
    }
    return new Response(JSON.stringify(searchTermData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }
};
