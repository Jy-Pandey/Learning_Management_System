// mdQyktp5yRlvuihM;
// mongodb+srv://2810jyotipandey:<db_password>@cluster0.lplzzwc.mongodb.net/
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const [
    registerUser,
    {
      data: registerData,
      isLoading: registerIsLoading,
      isError: registerIsError,
      isSuccess: registerIsSuccess,
      error: registerError,
    },
  ] = useRegisterUserMutation();
  // console.log("register data is ", registerData);

  const [
    loginUser,
    {
      data: loginData,
      isLoading: loginIsLoading,
      isError: loginIsError,
      isSuccess: loginIsSuccess,
      error : loginError,
    },
  ] = useLoginUserMutation();
  // const loginMutation = useLoginUserMutation();
  // console.log("loginMutation is ", loginMutation);
  // console.log("login error is ", loginError);

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    // console.log("input Data", inputData);
    // console.log("Type", type);
    // console.log("Action", action);
    await action(inputData); // send the input data to mutation (authApi)
  };

  const navigate = useNavigate();
  
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message);
    }
    if (registerIsError) {
      toast.error(registerError.data.message || "Signup failed");
    }
    if (loginIsSuccess && loginData) {
      navigate("/");
      toast.success(loginData.message);
    }
    if (loginIsError) {
      toast.error(loginError.data.message || "Login failed");
    }
  }, [registerIsSuccess, loginIsError, loginIsSuccess]);

  return (
    <div className="mt-20 w-full flex items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger className="cursor-pointer" value="signup">
            Signup
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="login">
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold">Signup</CardTitle>
              <CardDescription>
                If you are new to this website then create your account first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 ">
              <div className="space-y-1 mt-4 ">
                <Label htmlFor="name" className="ml-1 mb-2">
                  Name
                </Label>
                <Input
                  value={signupInput.name}
                  onChange={(e) => {
                    changeInputHandler(e, "signup");
                  }}
                  type="text"
                  name="name"
                  placeholder="eg. Jyoti"
                />
              </div>
              <div className="space-y-1 mt-6">
                <Label htmlFor="email" className="ml-1 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="jyotipandey@gmail.com"
                  value={signupInput.email}
                  onChange={(e) => {
                    changeInputHandler(e, "signup");
                  }}
                  required={true}
                />
              </div>
              <div className="space-y-1 mt-6">
                <Label htmlFor="password" className="ml-1 mb-2">
                  Password
                </Label>
                <Input
                  placeholder="Eg. xyz"
                  name="password"
                  type="password"
                  value={signupInput.password}
                  onChange={(e) => {
                    changeInputHandler(e, "signup");
                  }}
                  required={true}
                />
              </div>
            </CardContent>
            <CardFooter className=" flex justify-center">
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
                className="cursor-pointer"
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                    Please wait
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="font-semibold">Login</CardTitle>
              <CardDescription>
                If you already have an account then proceed to login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 mt-4">
                <Label htmlFor="email" className="ml-1 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="jyotipandey@gmail.com"
                  value={loginInput.email}
                  onChange={(e) => {
                    changeInputHandler(e, "login");
                  }}
                  required={true}
                />
              </div>
              <div className="space-y-1 mt-4">
                <Label htmlFor="password" className="ml-1 mb-2">
                  Password
                </Label>
                <Input
                  placeholder="Eg. xyz"
                  name="password"
                  type="password"
                  value={loginInput.password}
                  onChange={(e) => {
                    changeInputHandler(e, "login");
                  }}
                  required={true}
                />
              </div>
            </CardContent>
            <CardFooter className=" flex justify-center">
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
                className="cursor-pointer"
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
