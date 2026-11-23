import { Container } from "@/components/ui/Container";

export type SkeletonVariant = "home" | "list" | "article" | "page";

interface BoneProps {
  className: string;
}

function Bone({ className }: BoneProps) {
  return <div aria-hidden="true" className={`rounded-card bg-nila/10 motion-safe:animate-pulse ${className}`} />;
}

function LightBone({ className }: BoneProps) {
  return <div aria-hidden="true" className={`rounded-card bg-benang/15 motion-safe:animate-pulse ${className}`} />;
}

function BreadcrumbBone() {
  return <Bone className="h-6 w-56" />;
}

function HomeSkeleton() {
  return (
    <>
      <section className="bg-nila py-12 md:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <LightBone className="h-14 w-full max-w-xl md:h-32" />
            <LightBone className="mt-6 h-28 w-full max-w-md" />
            <div className="mt-8 flex flex-wrap gap-4">
              <LightBone className="h-12 w-44" />
              <LightBone className="h-12 w-52" />
            </div>
          </div>
          <LightBone className="mx-auto aspect-square w-full max-w-md lg:mr-0" />
        </Container>
      </section>
      <section className="py-12 md:py-16">
        <Container>
          <Bone className="h-10 w-full max-w-lg" />
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <Bone className="h-72 w-full" />
            <Bone className="h-72 w-full" />
            <Bone className="h-72 w-full" />
          </div>
        </Container>
      </section>
    </>
  );
}

function ListSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <BreadcrumbBone />
      <Bone className="mt-8 h-14 w-full max-w-xl" />
      <Bone className="mt-4 h-14 w-full max-w-md" />
      <div className="mt-10 space-y-4">
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
      </div>
    </Container>
  );
}

function ArticleSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <BreadcrumbBone />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="border border-nila/15 bg-benang px-5 py-8 md:px-10 md:py-12">
          <Bone className="h-12 w-full md:h-24" />
          <Bone className="mt-5 h-5 w-48" />
          <Bone className="mt-6 h-32 w-full" />
          <Bone className="mt-8 h-72 w-full" />
          <Bone className="mt-8 h-6 w-full" />
          <Bone className="mt-3 h-6 w-5/6" />
          <Bone className="mt-3 h-6 w-4/6" />
        </div>
        <Bone className="h-80 w-full" />
      </div>
    </Container>
  );
}

function PageSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      <BreadcrumbBone />
      <div className="mt-6 max-w-3xl border border-nila/15 bg-benang px-5 py-8 md:px-10 md:py-12">
        <Bone className="h-12 w-full md:h-24" />
        <Bone className="mt-6 h-24 w-full" />
        <Bone className="mt-10 h-8 w-2/3" />
        <Bone className="mt-4 h-6 w-full" />
        <Bone className="mt-3 h-6 w-5/6" />
        <Bone className="mt-10 h-8 w-2/3" />
        <Bone className="mt-4 h-6 w-full" />
        <Bone className="mt-3 h-6 w-4/6" />
      </div>
    </Container>
  );
}

interface RouteSkeletonProps {
  variant: SkeletonVariant;
}

export function RouteSkeleton({ variant }: RouteSkeletonProps) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Memuat halaman</span>
      {variant === "home" ? <HomeSkeleton /> : null}
      {variant === "list" ? <ListSkeleton /> : null}
      {variant === "article" ? <ArticleSkeleton /> : null}
      {variant === "page" ? <PageSkeleton /> : null}
    </div>
  );
}
