import WorkoutClient from "./workout-client";

const WorkoutPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <WorkoutClient slug={slug} />;
};

export default WorkoutPage;
