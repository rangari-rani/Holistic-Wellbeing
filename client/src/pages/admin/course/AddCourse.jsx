import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  //for displaying toast

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course created");
      navigate("/admin/course")
    }
  }, [isSuccess, error]);

  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add Course </h1>
        <p className="text-sm">
          Create and manage courses with essential details to streamline your
          learning or teaching process.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title </Label>
          <Input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            type="text"
            placeholder="Your course name"
          />
        </div>
        <div>
          <Label>Category </Label>
          <Select onValueChange={getSelectedCategory}>
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
