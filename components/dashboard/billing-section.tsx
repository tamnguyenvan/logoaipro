'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactions } from "@/hooks/useTransactions"

const plans = [
  { name: "Basic", price: "$9.99", generations: 100 },
  { name: "Pro", price: "$19.99", generations: 250 },
  { name: "Enterprise", price: "$49.99", generations: "Unlimited" },
]

// const billingHistory = [
//   { date: "2023-05-01", amount: "$19.99", status: "Paid" },
//   { date: "2023-04-01", amount: "$19.99", status: "Paid" },
//   { date: "2023-03-01", amount: "$19.99", status: "Paid" },
// ]

interface BillingHistoryItem {
  date: string;
  amount: string;
  status: string;
}

export function BillingSection() {
  const { transactions, loading } = useTransactions()
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <p className="text-sm text-gray-500">per month</p>
                  <p className="mt-2">{plan.generations} generations</p>
                  <Button className="mt-4 w-full">Select Plan</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
              <TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full mt-2" />
                    <Skeleton className="h-6 w-full mt-2" />
                  </TableCell>
                </TableRow>
              </TableRow>
            ) :
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(transaction.transaction_timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

