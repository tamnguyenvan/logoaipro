'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAction } from "next-safe-action/hooks"
import { fetchTransactionsAction } from "@/app/actions/transaction"
import { useEffect } from "react"
import { TransactionHistory } from "./billing"

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
  // const { transactions, loading } = useTransactions()
  const {
    execute: fetchTransactions,
    result,
    isPending
  } = useAction(fetchTransactionsAction, {
    
  })

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
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

      <TransactionHistory />
    </div>
  )
}

