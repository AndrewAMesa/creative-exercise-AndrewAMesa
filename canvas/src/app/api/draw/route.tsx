import { NextResponse } from "next/server";

let shape_num = 0;

export async function GET() {
    shape_num++;

    if (shape_num === 4) {
        shape_num = 0;
    }

    console.log(`Shape number: ${shape_num}`);
    return NextResponse.json({ message: "Draw request received", data: shape_num });
}