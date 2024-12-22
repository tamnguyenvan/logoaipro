'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  Search,
  CreditCard,
  DollarSign,
  Calendar,
  RefreshCw,
  FilterX,
  AlertCircle
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { fetchTransactionsAction } from '@/app/actions/transaction';
import { type Transaction } from '@/lib/validations/transaction';

export function TransactionHistory() {
  const initialTransactions: Transaction[] = [];
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    execute: fetchTransactions,
    result: transactionsResult,
    isPending: loading
  } = useAction(fetchTransactionsAction, {
    onSuccess: (data) => {
      const sortedTransactions = sortTransactions(data.data?.transactions ? data.data.transactions : []);
      setTransactions(sortedTransactions);
      setIsRefreshing(false);
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions();
  };

  const resetFilters = () => {
    setFilter('');
    setTypeFilter('All Types');
    setSortOrder('desc');
    setSortBy('date');
  };

  const sortTransactions = (transactions: Transaction[]) => {
    return transactions.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.transaction_timestamp).getTime() - new Date(b.transaction_timestamp).getTime()
          : new Date(b.transaction_timestamp).getTime() - new Date(a.transaction_timestamp).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });
  };

  const toggleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'refund':
        return 'bg-red-100 text-red-800';
      case 'credit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => {
      return sum + (transaction.transaction_type.toLowerCase() === 'refund' ? -transaction.amount : transaction.amount);
    }, 0);
  }, [transactions]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center">
            Recent Transactions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-gray-100"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className="mt-2">
          Showing {transactions.length} transactions
          {typeFilter !== 'All Types' && ` of type ${typeFilter}`}
        </CardDescription>

      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Refund">Refund</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              {(filter || typeFilter !== 'All Types' || sortOrder !== 'desc' || sortBy !== 'date') && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  className="shrink-0"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('amount')}
                      className={`font-semibold ${sortBy === 'amount' ? 'text-primary' : ''}`}
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort('date')}
                      className={`font-semibold ${sortBy === 'date' ? 'text-primary' : ''}`}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="space-y-2">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mb-2" />
                          <p>No transactions found matching your criteria.</p>
                          <Button
                            variant="link"
                            onClick={resetFilters}
                            className="mt-2"
                          >
                            Reset filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {transactions.map((transaction) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-muted/50 cursor-pointer"
                        >
                          <TableCell>
                            <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {transaction.transaction_type.toLowerCase() === 'refund' ? (
                                <DollarSign className="mr-1 h-4 w-4 text-red-500" />
                              ) : (
                                <CreditCard className="mr-1 h-4 w-4 text-green-500" />
                              )}
                              ${transaction.amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                              {new Date(transaction.transaction_timestamp).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3}>
                          <div className="flex justify-between items-center px-2 py-1">
                            <span className="font-medium">Total</span>
                            <span className="font-bold">${totalAmount.toFixed(2)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}