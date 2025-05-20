import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  //getting slug value from url
  const { slug } = useParams();
  const navigate = useNavigate();

  //if slug changes then bring the data value
  useEffect(() => {
    console.log("slug from useParams:", slug);
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        console.log("Fetched post:", post);
        if (post) {
          setPost(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
