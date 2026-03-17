"use client";

import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ContactsApi } from "@/lib/client/api";

function StatCard({
  title,
  value,
  isLoading,
  isError,
}: {
  title: string;
  value: string;
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
      <Text fontSize="sm" color="gray.500" mb={1}>
        {title}
      </Text>
      {isLoading ? (
        <Spinner size="sm" />
      ) : isError ? (
        <Text color="red.500" fontSize="sm">
          Failed to load...
        </Text>
      ) : (
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
      )}
    </Box>
  );
}

export default function QuickStatsCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts", "summary"],
    // NOTE: Loading all contacts for stats is a temporary solution.
    // A dedicated /api/v1/contacts/stats endpoint should be created
    // for server-side aggregation to avoid performance issues at scale.
    queryFn: () => ContactsApi.list(0, 1000),
  });

  const total = data?.count ?? 0;

  const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = data
    ? data.data.filter((c) => new Date(c.createdAt).getTime() > oneWeekAgoMs).length
    : 0;

  const latest = data?.data.reduce<{ organisation: string; createdAt: string } | null>(
    (newest, c) =>
      !newest || new Date(c.createdAt).getTime() > new Date(newest.createdAt).getTime()
        ? c
        : newest,
    null
  );
  const latestValue = latest
    ? `${latest.organisation} (${new Date(latest.createdAt).toLocaleDateString()})`
    : "–";

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
      <StatCard
        title="Total contacts"
        value={String(total)}
        isLoading={isLoading}
        isError={isError}
      />
      <StatCard
        title="Added this week"
        value={String(thisWeek)}
        isLoading={isLoading}
        isError={isError}
      />
      <StatCard
        title="Latest contact"
        value={latestValue}
        isLoading={isLoading}
        isError={isError}
      />
    </SimpleGrid>
  );
}
