import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    // Create a URL object to parse the incoming request URL
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename'); // Get the 'filename' from the query string

    // Check if filename is provided
    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Construct the path for the SVG file based on the filename
    const filePath = path.join(process.cwd(), 'public/assets/img/controls/', `${filename}.svg`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Send back the file content as JSON
    return NextResponse.json({ content: fileContent });
}
