import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, Lock, LogOut, Mail } from "lucide-react";
import { useState } from "react";
import { useGetAllSubmissions } from "../hooks/useQueries";

const ADMIN_PASSWORD = "5elements";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const {
    data: submissions,
    isLoading,
    isError,
  } = useGetAllSubmissions(authenticated);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
  };

  const handleBack = () => {
    window.location.hash = "";
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            data-ocid="admin.link"
          >
            <ArrowLeft size={16} />
            Back to site
          </button>

          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="pb-2 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "oklch(0.62 0.14 248 / 0.15)",
                  boxShadow: "0 0 24px oklch(0.62 0.14 248 / 0.25)",
                }}
              >
                <Lock size={24} className="text-primary" />
              </div>
              <CardTitle className="font-heading text-2xl">
                Admin Access
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Enter password to view submissions
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
                data-ocid="admin.modal"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="admin-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="bg-background/60 border-border focus:border-primary"
                    data-ocid="admin.input"
                  />
                </div>
                {error && (
                  <p
                    className="text-destructive text-sm"
                    data-ocid="admin.error_state"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:opacity-90 font-semibold w-full"
                  style={{ boxShadow: "0 0 16px oklch(0.62 0.14 248 / 0.3)" }}
                  data-ocid="admin.submit_button"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="admin.link"
            >
              <ArrowLeft size={16} />
              Back to site
            </button>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <img
                src="https://www.5elementsnodes.com/wp-content/uploads/2023/12/LOGO-1.png"
                alt="5 Elements Nodes"
                className="h-8 w-auto object-contain"
              />
              <span className="font-heading font-semibold text-sm hidden sm:inline">
                Admin Dashboard
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border hover:border-destructive/60 hover:text-destructive flex items-center gap-2"
            data-ocid="admin.secondary_button"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-1">
            Contact <span className="text-gradient">Submissions</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            All messages received through the contact form.
          </p>
        </div>

        {isLoading && (
          <div
            className="flex items-center justify-center py-24 gap-3 text-muted-foreground"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="animate-spin" size={20} />
            <span>Loading submissions...</span>
          </div>
        )}

        {isError && (
          <div
            className="rounded-2xl p-6 bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            data-ocid="admin.error_state"
          >
            Failed to load submissions. Please refresh and try again.
          </div>
        )}

        {!isLoading &&
          !isError &&
          submissions &&
          (submissions.length === 0 ? (
            <div
              className="rounded-2xl p-16 bg-card border border-border text-center"
              data-ocid="admin.empty_state"
            >
              <Mail
                size={36}
                className="mx-auto mb-4 text-muted-foreground/40"
              />
              <p className="text-muted-foreground font-medium">
                No submissions yet.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Messages will appear here once someone fills out the contact
                form.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden bg-card">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {submissions.length}{" "}
                  {submissions.length === 1 ? "submission" : "submissions"}
                </span>
              </div>
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold">
                      #
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Message
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission, i) => (
                    <TableRow
                      key={`${submission.email}-${i}`}
                      className="border-border hover:bg-muted/30 transition-colors"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground/60 text-sm font-mono">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-primary hover:underline text-sm"
                        >
                          {submission.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs">
                        <span className="line-clamp-2">
                          {submission.message}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
      </main>
    </div>
  );
}
