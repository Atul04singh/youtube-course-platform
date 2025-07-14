from yt_dlp import YoutubeDL
from pymongo import MongoClient

# Step 1: Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017")
db = client.youtubeApp
course_collection = db.courses

# Step 2: Playlist URL
playlist_url = input("Enter Playlist URL: ")

# Step 3: Extract playlist info
ydl_opts = {
    'quiet': True,
    'extract_flat': True,
    'dump_single_json': True,
}

with YoutubeDL(ydl_opts) as ydl:
    result = ydl.extract_info(playlist_url, download=False)

    if 'entries' in result:
        playlist_title = result.get('title', 'Untitled Playlist')
        playlist_id = result.get('id')

        video_list = []
        for i, video in enumerate(result['entries'], start=1):
            video_list.append({
                "serial": i,
                "title": video['title'],
                "videoId": video['id'],
                "url": f"https://www.youtube.com/watch?v={video['id']}"
            })

        # Step 4: Save in courseDb structure
        course_doc = {
            "title": playlist_title,
            "playlistId": playlist_id,
            "playlistUrl": playlist_url,
            "videos": video_list
        }

        inserted = course_collection.insert_one(course_doc)
        print(f"✅ Course saved with _id: {inserted.inserted_id}")
