'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export function TransactionHistory() {
  const { transactions, loading } = useTransactions()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
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
  )
}

