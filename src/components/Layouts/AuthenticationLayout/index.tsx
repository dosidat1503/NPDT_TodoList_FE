const AuthenticationLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="">
      <main className="bg-sky-200 p-10 h-screen text-center flex justify-center">{children}</main>
    </div>
  );
};

export default AuthenticationLayout;
