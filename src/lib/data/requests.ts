import type { TopicRequest } from "@/lib/types";

/**
 * Mock topic registry. This is the single source used by both the creator and
 * admin views — the difference is *what fields are exposed*, not the data.
 *
 * Replace this array with an API call later; the shape mirrors what a
 * `GET /topic-requests` endpoint would return.
 */
export const topicRequests: TopicRequest[] = [
  // ----- Other creators (identity hidden from creators, shown to admins) -----
  {
    id: "req-10",
    creatorId: "u-taylor",
    title: "How to Deploy Ory Keto - Open-Source Permission and Access Control Server",
    description:
      "Deploy Ory Keto on a Linux server using Docker Compose with PostgreSQL and Traefik for automatic HTTPS to run a self-hosted Zanzibar-style permission server.",
    status: "Under Review",
    submittedAt: "2026-09-05",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-11",
    creatorId: "u-jordan",
    title: "How to Deploy Apache Flink on Kubernetes Engine as Alternative to GCP Dataflow",
    description:
      "Deploy Apache Flink on Kubernetes using the Flink Kubernetes Operator with checkpointing and Kafka, as a self-hosted alternative to Google Cloud Dataflow.",
    status: "In Progress",
    submittedAt: "2026-09-04",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-12",
    creatorId: "u-casey",
    title: "How to Deploy Penpot - Open-Source Design and Prototyping Platform",
    description:
      "Deploy Penpot on a Linux server using Docker Compose with PostgreSQL, Valkey, and Traefik for TLS termination to run a self-hosted UI design platform.",
    status: "Approved",
    submittedAt: "2026-09-05",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-13",
    creatorId: "u-riley",
    title: "How to Deploy Portkey - Open-Source AI Gateway for LLM Routing",
    description:
      "Deploy Portkey on a Linux server using Docker Compose with Traefik for TLS, Basic Authentication, and an IP allowlist to run an OpenAI-compatible AI gateway.",
    status: "Under Review",
    submittedAt: "2026-09-06",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-14",
    creatorId: "u-taylor",
    title: "How to Deploy Fluxer - An Open Source Instant Messaging and VoIP Platform",
    description:
      "Deploy Fluxer on a Linux server using Docker Compose with PostgreSQL, Valkey, NATS, Meilisearch, SeaweedFS, LiveKit, and Caddy for a messaging platform.",
    status: "In Progress",
    submittedAt: "2026-09-03",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-15",
    creatorId: "u-jordan",
    title: "How to Deploy Langflow - Open-Source Visual Framework for Building AI Applications",
    description:
      "Deploy Langflow on a Linux server using Docker Compose with PostgreSQL persistence, Traefik, automatic HTTPS, and OpenAI integration to build a RAG chatbot.",
    status: "Published",
    submittedAt: "2026-08-30",
    updatedAt: "2026-09-09",
    publishedAt: "2026-09-09",
  },
  {
    id: "req-16",
    creatorId: "u-casey",
    title: "How to Deploy Logto as a GCP Identity Platform Alternative",
    description:
      "Deploy Logto on a Linux server using Docker Compose with PostgreSQL and Traefik for HTTPS, as a self-hosted CIAM alternative to Google Cloud Identity Platform.",
    status: "Approved",
    submittedAt: "2026-09-04",
    updatedAt: "2026-09-09",
  },
  {
    id: "req-17",
    creatorId: "u-riley",
    title: "How to Deploy Kubeflow as an Azure ML Alternative",
    description:
      "Deploy Kubeflow on a Kubernetes cluster with Kustomize, KServe, and Katib as a self-hosted alternative to Azure Machine Learning for ML pipelines and training.",
    status: "Under Review",
    submittedAt: "2026-09-07",
    updatedAt: "2026-09-11",
  },
  {
    id: "req-18",
    creatorId: "u-taylor",
    title: "How to Deploy Apache Kafka as an AWS Kinesis Data Firehose Alternative",
    description:
      "Deploy Apache Kafka with Strimzi on Kubernetes as a self-hosted Amazon Data Firehose alternative with Kafka Connect, S3 sinks, transformations, security, and monitoring.",
    status: "Published",
    submittedAt: "2026-08-20",
    updatedAt: "2026-09-11",
    publishedAt: "2026-09-11",
  },
  {
    id: "req-19",
    creatorId: "u-jordan",
    title: "How to Deploy Activepieces - Open-Source Business Automation Platform",
    description:
      "Deploy Activepieces on a Linux server using Docker Compose with PostgreSQL, Redis, Traefik, automatic HTTPS, and custom automation workflows.",
    status: "Rejected",
    submittedAt: "2026-07-28",
    updatedAt: "2026-08-04",
    reviewedAt: "2026-08-04",
  },
];
