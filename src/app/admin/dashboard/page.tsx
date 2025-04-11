"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, Download, Users, FileText, PieChart } from "lucide-react"
import { AdminStudentTable } from "@/components/admin-student-table"
import { AdminCharts } from "@/components/admin-charts"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setIsAdmin(true) // In a real app, you'd check if the user is an admin
        await fetchStudents()
      } else {
        router.push("/admin/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "studentRecords"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const studentData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStudents(studentData)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      setDeleting(id)
      try {
        await deleteDoc(doc(db, "studentRecords", id))
        setStudents(students.filter((student) => student.id !== id))
      } catch (error) {
        console.error("Error deleting record:", error)
      } finally {
        setDeleting(null)
      }
    }
  }

  const handleDownloadCSV = () => {
    if (students.length === 0) return

    // Get all unique keys from all student objects
    const allKeys = new Set<string>()
    students.forEach((student) => {
      Object.keys(student).forEach((key) => {
        if (key !== "id" && key !== "createdAt") {
          allKeys.add(key)
        }
      })
    })

    // Create CSV header row
    const headers = Array.from(allKeys)
    let csv = headers.join(",") + "\n"

    // Add data rows
    students.forEach((student) => {
      const row = headers.map((header) => {
        const value = student[header] || ""
        // Escape commas and quotes in the value
        return `"${String(value).replace(/"/g, '""')}"`
      })
      csv += row.join(",") + "\n"
    })

    // Create and download the CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `student_records_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">You do not have permission to access this page.</p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Student Management System
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage student records and view analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCSV} disabled={students.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(students.map((s) => s.program)).size}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fee Collected</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {students
                  .reduce((sum, student) => sum + (Number.parseInt(student.feeDeposited) || 0), 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records" className="mt-6">
          <TabsList>
            <TabsTrigger value="records">Student Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="records" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Records</CardTitle>
                <CardDescription>View and manage all student information</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminStudentTable students={students} onDelete={handleDeleteRecord} deletingId={deleting} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Analytics</CardTitle>
                <CardDescription>Visual representation of student data</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCharts students={students} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
