import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

{
  /*watch = used to monitor a field continuously*/
}
{
  /*setValue = used to set a value in a form because we are using react-hook-form*/
}
{
  /*control = used to get control of a form. we will pass this control as it is in RTE, then we will get control of RTE here*/
}
{
  /*getValues = used to grab values of form*/
}
function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  {
    {
      /*getting userData from state*/
    }
  }
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    {
      {
        /*if post already exists then we update it*/
      }
    }
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      {
        {
          /*if we have uploaded the image then delete the previously posted post image*/
        }
      }
      if (file) {
        await appwriteService.deleteFile(post.featuredImage);
      }
      {
        {
          /*updating the changes of the post*/
        }
      }
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      {
        {
          /*navigating the user to the updated post*/
        }
      }
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      {
        {
          /*if there is no existing post then we create a new post*/
        }
      }
      {
        {
          /*uploading the image*/
        }
      }
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        {
          {
            /*creating the post*/
          }
        }
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        {
          {
            /*navigating the user to the created post*/
          }
        }
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    {
      /*replace(/^[a-zA-Z\d\s]+/g, '-') it does not matches alphabets, numbers and spaces and replaces else content with "-"*/
    }
    {
      /*replace(/\s/g, '-') it replaces all the spaces globally with "-"*/
    }
    {
      /*if there is nothing in the value*/
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    {
      /*Optimization*/
    }
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
