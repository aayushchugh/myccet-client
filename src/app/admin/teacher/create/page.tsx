"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInput {
  avatar: FileList;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  teacherRole: string;
}

export default function TeacherRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-dvh flex flex-col justify-center items-center"
    >
      <div className="grid gap-4 w-full max-w-3xl">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="avatar">Avatar</Label>
          <Input required id="avatar" type="file" {...register("avatar")} />
          {errors.avatar && (
            <span style={{ color: "red" }}>{errors.avatar.message}</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label required htmlFor="firstName">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span style={{ color: "red" }}>{errors.firstName.message}</span>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              placeholder="Middle Name"
              {...register("middleName")}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <span style={{ color: "red" }}>{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label required htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span style={{ color: "red" }}>{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label required htmlFor="phoneNumber">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
          />
          {errors.phoneNumber && (
            <span style={{ color: "red" }}>{errors.phoneNumber.message}</span>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label required htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password.message}</span>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label required htmlFor="teacherRole">
            Teacher Role
          </Label>
          <Input
            id="teacherRole"
            placeholder="Enter your role"
            {...register("teacherRole", { required: "Role is required" })}
          />
          {errors.teacherRole && (
            <span style={{ color: "red" }}>{errors.teacherRole.message}</span>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button type="submit">Register</Button>
      </div>
    </form>
  );
}
