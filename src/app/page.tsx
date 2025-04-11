import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Student Management System</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Student Management System
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              A comprehensive system for managing student information and fee records
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Student Portal</h2>
              <p className="mb-6 text-center text-muted-foreground">Login to fill your information and fee details</p>
              <Link href="/student/login" className="w-full">
                <Button className="w-full" size="lg">
                  Student Login
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Admin Portal</h2>
              <p className="mb-6 text-center text-muted-foreground">
                Login to view student records, analytics, and manage data
              </p>
              <Link href="/admin/login" className="w-full">
                <Button className="w-full" size="lg">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Student Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
