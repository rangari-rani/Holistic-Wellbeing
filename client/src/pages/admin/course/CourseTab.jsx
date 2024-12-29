import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
    useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const [publishCourse,{}] = usePublishCourseMutation()

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({courseId, query:action})
      if(response.data){
        refetch();
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course")
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course");
    }
    if (courseByIdLoading) <h1>Loading..</h1>;
  }, [isSuccess, error]);

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);



  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button disabled={courseByIdData?.course.lectures.length === 0}
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
            variant="outline"
          >
            {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <Label>Title</Label>
          <Input
            type="text"
            value={input.courseTitle}
            onChange={changeEventHandler}
            placeholder="Enter course title"
            name="courseTitle"
          />
        </div>
        <div className="space-y-4 mt-5">
          <Label>Subtitle</Label>
          <Input
            type="text"
            value={input.subTitle}
            onChange={changeEventHandler}
            placeholder="Enter subtitle"
            name="subTitle"
          />
        </div>
        <div className="space-y-4 mt-5">
          <Label>Description</Label>
          <RichTextEditor
            input={input}
            setInput={(updatedInput) =>
              setInput({ ...input, description: updatedInput.description })
            }
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="space-y-4 mt-5">
            <Label>Category</Label>
            <Select onValueChange={selectCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="emotions">Emotions</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 mt-5">
            <Label>Course Level </Label>
            <Select onValueChange={selectCourseLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a course level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course Level </SelectLabel>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 mt-5">
            <Label>Price in (INR)</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              placeholder="199"
              className="w-fit"
            />
          </div>
        </div>
        <div className="space-y-4 mt-5">
          <Label>Course Thumbnail</Label>
          <Input
            onChange={selectThumbnail}
            type="file"
            accept="image/*"
            className="w-fit"
          />
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              className="w-64 my-2 "
              alt="Course Thumbnail"
            />
          )}
        </div>
        <div className="space-y-4 mt-2 space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Cancel{" "}
          </Button>
          <Button onClick={updateCourseHandler} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
