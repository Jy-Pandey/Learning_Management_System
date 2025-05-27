import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useEditLectureMutation, useGetCourseByIdQuery, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null); // store url and public id
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false); // Progress shuru hua hai ya nhi
  const [uploadProgress, setUploadProgress] = useState(0); // Kitna progress hua h
  const [btnDisable, setBtnDisable] = useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const {courseId, lectureId} = params;

  const {data : lectureData, error : lectureError} = useGetLectureByIdQuery({courseId, lectureId});
  const lecture = lectureData?.data;
  const [
    removeLecture,
    {
      data: removeData,
      isSuccess: removeIsSuccess,
      isLoading: removeIsLoading,
      isError : removeIsError,
      error : removeError
    },
  ] = useRemoveLectureMutation();

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree ?? false); //-?? false means: "if it's null or undefined, fallback to false"
    }
    if(lectureError) {
      toast.error(lectureError?.data?.message)
    }
  }, [lecture, lectureError]);

  const [editLecture, {data, isLoading, isSuccess, isError, error}] = useEditLectureMutation();
  const handleEditLecture = async() => {
    // console.log("Fields are :", lectureTitle, uploadVideInfo, isFree );
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree : isFree,
      courseId,
      lectureId
    });
  }

  useEffect(()=> {
    if(isSuccess && data) {
      navigate(`/admin/course/${courseId}/lecture`);
      toast.success(data?.message || "lecture updated")
    }
    if(isError && error) {
      toast.error(error?.data?.message || "Error in updating lecture")
    }
  }, [isSuccess, isError])

  const handleRemoveLecture = async() => {
    await removeLecture({courseId, lectureId})
  }
  useEffect(() => {
    if (removeIsSuccess) {
      navigate(`/admin/course/${courseId}/lecture`);
      toast.success(removeData.message);
    }
    if(removeIsError && removeError) {
      toast.error(removeError?.data?.message)
    }
  }, [removeIsSuccess, removeIsError]);

  const UPLOAD_MEDIA = "http://localhost:8080/api/v1/media/upload-video";

  const handleFileChange = async (e) => {
    const lectureVideo = e.target.files[0];
    // console.log("selected File", lectureVideo);
    
    if(lectureVideo) {
      try {
        const formData = new FormData();
        formData.append("lectureVideo", lectureVideo);
        setMediaProgress(true);
        setBtnDisable(true); // disable update lecture button untill video not fully uploaded
        // cloudinary par upload krke response se publicId, url nikal lo
        const result = await axios.post(UPLOAD_MEDIA, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (result) {
          console.log("cloudinary Result", result);
          setUploadVideoInfo({
            videoUrl: result.data.data.url,
            publicId: result.data.data.public_id,
          });
          toast(result?.data?.message || "Uploaded");
        }
      } catch (error) {
        console.log("Error in funvtion : ", error);
        toast.error("video upload failed");
      } finally {
        setBtnDisable(false);
        setMediaProgress(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={removeIsLoading}
            variant="destructive"
            onClick={handleRemoveLecture}
          >
            {removeIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 ml-2">Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-8">
          <Label className="mb-2 ml-2">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-6">
          <Switch
            checked={isFree}
            // onCheckedChange={setIsFree} // jab toggle karo, Switch naya value dega argument me automatic
            onCheckedChange={(value) => setIsFree(value)}
            className="data-[state=checked]:bg-blue-500"
            id="isVideoFree"
          />
          <Label htmlFor="isVideoFree">Is this video FREE</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-8">
          <Button
            // disabled={isLoading}
            disabled={isLoading || btnDisable}
            onClick={handleEditLecture}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
