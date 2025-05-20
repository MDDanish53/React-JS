import React from "react";
{
  /*importing as it is not available in the state*/
}
import appwriteService from "../appwrite/config";
{
  /*we imported appwriteService because we have to apply query and service will apply the query. if it was in state, then we can use redux and can take information from state*/
}
import { Link } from "react-router-dom";

{
  /*$id is appwrite syntax, featuredImage is file id of image*/
}
function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
