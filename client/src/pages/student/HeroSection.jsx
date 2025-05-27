import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();
  const[searchQuery, setSearchQuery] = useState("");

  const handleSearchCourse = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      // console.log(searchQuery);
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 pt-30 pb-18 px-4 text-center">
      <div className="max-w-3xl mx-auto bg-gr">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>
        <form
          onSubmit={(e) => handleSearchCourse(e)}
          className="flex max-w-xl mx-auto bg-white dark:bg-gray-800 items-center mb-8 rounded-full shadow-lg"
        >
          <Input
            placeholder="Search courses.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow focus-visible:ring-0 border-none px-6 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-800 "
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900  text-white rounded-r-full px-6 py-3 cursor-pointer"
          >
            Search
          </Button>
        </form>
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-white py-3 px-6 cursor-pointer dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
}
