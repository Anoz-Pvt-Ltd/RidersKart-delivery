import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import ButtonWrapper from "../../Components/Buttons";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { DomainUrl, FetchData } from "../../utility/fetchFromAPI";
import { useDispatch } from "react-redux";
import { alertError, alertSuccess } from "../../utility/Alert";
import { parseErrorMessage } from "../../utility/ErrorMessageParser";
import { addUser, clearUser } from "../../utility/Slice/UserInfoSlice";
import Label from "../../Components/Label";
import io from "socket.io-client";
import LogInImg from "../../assets/Home/LogIn1.jpeg";
import LoginDriverImg from "../../assets/Home/LoginDriverImg.jpg";
import Input from "../../Components/Input";

const socket = io(DomainUrl);

const LogIn = () => {
  // Utility variables
  const FormRef = useRef(null);
  const [selectedForm, setSelectedForm] = useState("Personal");
  const [showPassword, setShowPassword] = useState("password");
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  // All function

  const handleRadioChange = (event) => {
    setSelectedForm(event.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(FormRef.current);

    const partialUrl =
      selectedForm === "Personal" ? "user/login" : "driver/login";

    try {
      const response = await FetchData(partialUrl, "post", formData);

      console.log(response);

      // Storing the tokens into browser's local storage
      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.AccessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.RefreshToken
      );

      socket.emit("UsersRoom", response?.data?.data?.user?._id);

      // Storing data inside redux store
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));

      // Navigate to home page and show success message
      if (selectedForm === "Personal") {
        navigate("/");
        Dispatch(
          addUser({
            driver: false,
            personal: true,
          })
        );
        localStorage.setItem("user", "personal");
        console.log("New custom obj added successfully");
      } else {
        navigate("/drivers-home");
        Dispatch(
          addUser({
            driver: true,
            personal: false,
          })
        );
        localStorage.setItem("user", "driver");
        console.log("New custom obj added successfully");
      }

      alertSuccess(response.data.message);
    } catch (error) {
      console.log(error);
      // alertError(parseErrorMessage(error.response.data));
    }
  };

  return (
    <div className=" shadow-lg laptop:flex justify-center items-center w-full h-full bg-color-standard py-20 gap-20">
      <section className="LOGIN-IMG w-[40%] hidden lg-block ">
        {selectedForm === "Personal" ? (
          <img src={LogInImg} alt="" className="laptop:h-[60vh] phone:w-full" />
        ) : (
          <img
            src={LoginDriverImg}
            alt=""
            className="laptop:h-[60vh] phone:w-full"
          />
        )}
      </section>

      <section className="Form_side bg-white border m-5 px-24 rounded-lg shadow-lg ">
        <h1 className="text-center mt-2 mb-5 text-xl text-black font-bold font-serif heading-text-gray">
          Login
        </h1>

        <div className="Radio-btn flex justify-evenly ">
          <div className="flex items-center justify-center gap-2 mx-5  ">
            <input
              type="radio"
              name="Form"
              id="Personal"
              value="Personal"
              onChange={handleRadioChange}
              defaultChecked
            />
            <Label htmlFor="Personal">Personal</Label>
          </div>
          <div className="flex justify-center items-center gap-2 mx-5 ">
            <input
              type="radio"
              name="Form"
              id="DeliveryPartner"
              value="DeliveryPartner"
              onChange={handleRadioChange}
            />
            <Label htmlFor="DeliveryPartner">Delivery Partner</Label>
          </div>
        </div>

        {selectedForm === "Personal" && (
          <form
            ref={FormRef}
            onSubmit={handelSubmit}
            className="Form  flex flex-col justify-center items-center "
          >
            <div className="Email w-72 m-2  ">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="joe@example.com"
                name="email"
                required
              />
            </div>
            <div className="password relative w-72 m-2 ">
              <Label htmlFor="password">Password</Label>
              <Input
                type={`${showPassword}`}
                name="password"
                placeholder={"password"}
                required
              />

              {/* show and hide password */}
              <div className="absolute right-10 top-12 ">
                {showPassword === "password" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword("text");
                    }}
                    className="text-sm "
                  >
                    <EyeOff />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword("password");
                    }}
                    className=" text-sm text-blue-600"
                  >
                    <Eye />
                  </button>
                )}
              </div>
            </div>
            <div className="LoginButton flex justify-center">
              <ButtonWrapper type="submit">Login</ButtonWrapper>
            </div>
          </form>
        )}

        {selectedForm === "DeliveryPartner" && (
          <form
            ref={FormRef}
            onSubmit={handelSubmit}
            className="Form  flex flex-col justify-center items-center "
          >
            <div className="Phone w-72 m-2">
              <Label className="block mb-2 text-lg font-semibold w-fit text-black   font-Philosopher">
                Phone
              </Label>
              <Input
                type="number"
                placeholder="62020******"
                name="phone"
                required
              />
            </div>
            <div className="password relative w-72 m-2">
              <Label
                htmlFor="password"
                className="block mb-2 text-lg font-semibold w-fit text-black  font-Philosopher "
              >
                Password
              </Label>
              <Input
                type={`${showPassword}`}
                placeholder="****"
                name="password"
                required
              />

              {/* show and hide password */}
              <div className="absolute right-10 top-12 ">
                {showPassword === "password" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword("text");
                    }}
                    className="text-sm text-blue-600"
                  >
                    <EyeOff color="#05668d" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword("password");
                    }}
                    className=" text-sm text-blue-600"
                  >
                    <Eye color="#05668d" />
                  </button>
                )}
              </div>
            </div>
            <div className="LoginButton flex justify-center">
              <ButtonWrapper type="submit">Login</ButtonWrapper>
            </div>
          </form>
        )}

        <div className="Sign_UP_Options mb-3">
          <h3 className="text-center text-black text-opacity-80 shadow rounded-xl p-2">
            Don't have an account ?
            <Link to={`/register`} className="text-red-400 hover:underline">
              Register
            </Link>
          </h3>
        </div>
        <div className="Sign_UP_Options mb-3">
          <h3 className="flex justify-center items-center text-center text-black text-opacity-80 shadow rounded-xl p-2">
            To become delivery partner{" "}
            <span>
              <ChevronRight />
            </span>
            <Link
              to={`/register-driver`}
              className="text-red-400 hover:underline"
            >
              Register
            </Link>
          </h3>
        </div>
      </section>
    </div>
  );
};

export default LogIn;
