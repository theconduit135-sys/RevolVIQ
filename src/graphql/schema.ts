import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  enum Role {
    OWNER
    ADMIN
    MEMBER
    VIEWER
  }

  enum LeadStatus {
    NEW
    CONTACTED
    QUALIFIED
    DISQUALIFIED
    CONVERTED
  }

  enum ScanStatus {
    QUEUED
    RUNNING
    COMPLETED
    FAILED
  }

  enum DisputeStatus {
    DRAFT
    SENT
    IN_PROGRESS
    RESOLVED
    REJECTED
    CANCELED
  }

  enum OrderStatus {
    CREATED
    PAID
    PARTIALLY_REFUNDED
    REFUNDED
    CANCELED
  }

  enum PaymentStatus {
    REQUIRES_ACTION
    PROCESSING
    SUCCEEDED
    FAILED
    CANCELED
  }

  enum ProductType {
    ONE_TIME
    SUBSCRIPTION
    ADD_ON
    UPGRADE
  }

  enum EventType {
    AUTH_LOGIN
    AUTH_LOGOUT
    USER_UPDATED
    ORG_CREATED
    ORG_UPDATED
    MEMBER_INVITED
    MEMBER_ROLE_CHANGED
    LEAD_CREATED
    LEAD_UPDATED
    SCAN_CREATED
    SCAN_STATUS_CHANGED
    DISPUTE_CREATED
    DISPUTE_UPDATED
    ORDER_CREATED
    ORDER_PAID
    PAYMENT_STATUS_CHANGED
    DOC_UPLOADED
    DOC_DELETED
    NOTE_CREATED
    NOTE_DELETED
  }

  """
  Viewer context is derived from the auth token.
  uid is the canonical user id (Firebase auth uid).
  """
  type Viewer {
    uid: ID!
    user: User!
    orgs: [Organization!]!
    activeOrg: Organization
  }

  type User {
    id: ID!
    uid: ID!
    email: String!
    phone: String
    displayName: String
    photoUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Organization {
    id: ID!
    ownerUid: ID!
    name: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    members: [OrgMember!]!
  }

  type OrgMember {
    id: ID!
    orgId: ID!
    uid: ID!
    role: Role!
    createdAt: DateTime!
  }

  type Invite {
    id: ID!
    orgId: ID!
    email: String!
    role: Role!
    token: String!
    createdAt: DateTime!
    expiresAt: DateTime!
    acceptedAt: DateTime
  }

  type Lead {
    id: ID!
    orgId: ID!
    createdByUid: ID!
    status: LeadStatus!
    firstName: String
    lastName: String
    email: String
    phone: String
    source: String
    tags: [String!]!
    notesCount: Int!
    lastContactedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Note {
    id: ID!
    orgId: ID!
    entityType: String!
    entityId: ID!
    createdByUid: ID!
    body: String!
    createdAt: DateTime!
  }

  type Document {
    id: ID!
    orgId: ID!
    ownerUid: ID!
    entityType: String!
    entityId: ID!
    filename: String!
    mimeType: String!
    sizeBytes: Int!
    storagePath: String!
    sha256: String
    createdAt: DateTime!
  }

  """
  Scan represents a RevolvIQ underwriting/credit scan request.
  """
  type Scan {
    id: ID!
    orgId: ID!
    ownerUid: ID!
    leadId: ID
    status: ScanStatus!
    input: JSON
    result: JSON
    score: Int
    riskFlags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    completedAt: DateTime
    errorMessage: String
  }

  type Report {
    id: ID!
    orgId: ID!
    ownerUid: ID!
    scanId: ID!
    summary: String!
    sections: [ReportSection!]!
    createdAt: DateTime!
  }

  type ReportSection {
    key: String!
    title: String!
    body: String!
    data: JSON
  }

  type Dispute {
    id: ID!
    orgId: ID!
    ownerUid: ID!
    leadId: ID
    scanId: ID
    status: DisputeStatus!
    bureau: String
    disputeItems: [DisputeItem!]!
    letterHtml: String
    letterPdfDocId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
    sentAt: DateTime
  }

  type DisputeItem {
    id: ID!
    type: String!
    creditor: String
    accountNumberMasked: String
    reason: String!
    evidenceDocIds: [ID!]!
    metadata: JSON
  }

  type Product {
    id: ID!
    orgId: ID!
    name: String!
    description: String
    type: ProductType!
    active: Boolean!
    currency: String!
    amountCents: Int!
    stripePriceId: String
    stripeProductId: String
    metadata: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Order {
    id: ID!
    orgId: ID!
    buyerUid: ID!
    status: OrderStatus!
    currency: String!
    subtotalCents: Int!
    totalCents: Int!
    items: [OrderItem!]!
    stripeCheckoutSessionId: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    productId: ID!
    name: String!
    quantity: Int!
    amountCents: Int!
    metadata: JSON
  }

  type Payment {
    id: ID!
    orgId: ID!
    buyerUid: ID!
    orderId: ID!
    status: PaymentStatus!
    currency: String!
    amountCents: Int!
    stripePaymentIntentId: String
    stripeCustomerId: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Upgrade {
    id: ID!
    orgId: ID!
    buyerUid: ID!
    fromProductId: ID!
    toProductId: ID!
    deltaCents: Int!
    currency: String!
    orderId: ID
    createdAt: DateTime!
  }

  type AuditEvent {
    id: ID!
    orgId: ID!
    actorUid: ID!
    type: EventType!
    entityType: String
    entityId: ID
    detail: JSON
    createdAt: DateTime!
  }

  input PaginationInput {
    limit: Int = 25
    cursor: String
  }

  type PageInfo {
    nextCursor: String
    hasNextPage: Boolean!
  }

  type LeadConnection {
    nodes: [Lead!]!
    pageInfo: PageInfo!
  }

  type ScanConnection {
    nodes: [Scan!]!
    pageInfo: PageInfo!
  }

  type DisputeConnection {
    nodes: [Dispute!]!
    pageInfo: PageInfo!
  }

  type Query {
    viewer: Viewer!

    organization(id: ID!): Organization
    organizations: [Organization!]!

    lead(id: ID!): Lead
    leads(status: LeadStatus, tag: String, pagination: PaginationInput): LeadConnection!

    scan(id: ID!): Scan
    scans(status: ScanStatus, leadId: ID, pagination: PaginationInput): ScanConnection!

    reportByScan(scanId: ID!): Report

    dispute(id: ID!): Dispute
    disputes(status: DisputeStatus, leadId: ID, pagination: PaginationInput): DisputeConnection!

    products(active: Boolean): [Product!]!
    order(id: ID!): Order
    orders(pagination: PaginationInput): [Order!]!

    payments(orderId: ID): [Payment!]!

    auditEvents(entityType: String, entityId: ID, pagination: PaginationInput): [AuditEvent!]!
  }

  input CreateOrganizationInput {
    name: String!
    slug: String!
  }

  input UpdateOrganizationInput {
    name: String
    slug: String
  }

  input InviteMemberInput {
    orgId: ID!
    email: String!
    role: Role!
  }

  input AcceptInviteInput {
    token: String!
  }

  input UpdateMemberRoleInput {
    orgId: ID!
    uid: ID!
    role: Role!
  }

  input CreateLeadInput {
    orgId: ID!
    firstName: String
    lastName: String
    email: String
    phone: String
    source: String
    tags: [String!]
  }

  input UpdateLeadInput {
    status: LeadStatus
    firstName: String
    lastName: String
    email: String
    phone: String
    source: String
    tags: [String!]
    lastContactedAt: DateTime
  }

  input CreateNoteInput {
    orgId: ID!
    entityType: String!
    entityId: ID!
    body: String!
  }

  input UploadDocumentInput {
    orgId: ID!
    entityType: String!
    entityId: ID!
    filename: String!
    mimeType: String!
    sizeBytes: Int!
    sha256: String
  }

  type UploadDocumentResult {
    doc: Document!
    signedUploadUrl: String!
  }

  input CreateScanInput {
    orgId: ID!
    leadId: ID
    input: JSON
  }

  input UpdateScanStatusInput {
    id: ID!
    status: ScanStatus!
    result: JSON
    score: Int
    riskFlags: [String!]
    errorMessage: String
  }

  input CreateDisputeInput {
    orgId: ID!
    leadId: ID
    scanId: ID
    bureau: String
    disputeItems: [CreateDisputeItemInput!]!
  }

  input CreateDisputeItemInput {
    type: String!
    creditor: String
    accountNumberMasked: String
    reason: String!
    evidenceDocIds: [ID!]
    metadata: JSON
  }

  input UpdateDisputeInput {
    status: DisputeStatus
    bureau: String
    disputeItems: [CreateDisputeItemInput!]
    letterHtml: String
    letterPdfDocId: ID
    sentAt: DateTime
  }

  input CreateProductInput {
    orgId: ID!
    name: String!
    description: String
    type: ProductType!
    active: Boolean = true
    currency: String!
    amountCents: Int!
    stripePriceId: String
    stripeProductId: String
    metadata: JSON
  }

  input UpdateProductInput {
    name: String
    description: String
    active: Boolean
    amountCents: Int
    stripePriceId: String
    stripeProductId: String
    metadata: JSON
  }

  input CreateOrderInput {
    orgId: ID!
    items: [CreateOrderItemInput!]!
    successUrl: String!
    cancelUrl: String!
  }

  input CreateOrderItemInput {
    productId: ID!
    quantity: Int! = 1
  }

  type CreateOrderResult {
    order: Order!
    stripeCheckoutUrl: String!
  }

  input CreateUpgradeInput {
    orgId: ID!
    fromProductId: ID!
    toProductId: ID!
    successUrl: String!
    cancelUrl: String!
  }

  type CreateUpgradeResult {
    upgrade: Upgrade!
    stripeCheckoutUrl: String!
  }

  type Mutation {
    """
    Upserts the current user profile using auth claims as source of truth.
    """
    syncViewer: Viewer!

    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: ID!, input: UpdateOrganizationInput!): Organization!

    inviteMember(input: InviteMemberInput!): Invite!
    acceptInvite(input: AcceptInviteInput!): Viewer!
    updateMemberRole(input: UpdateMemberRoleInput!): OrgMember!

    createLead(input: CreateLeadInput!): Lead!
    updateLead(id: ID!, input: UpdateLeadInput!): Lead!
    deleteLead(id: ID!): Boolean!

    createNote(input: CreateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!

    uploadDocument(input: UploadDocumentInput!): UploadDocumentResult!
    deleteDocument(id: ID!): Boolean!

    createScan(input: CreateScanInput!): Scan!
    updateScanStatus(input: UpdateScanStatusInput!): Scan!

    createDispute(input: CreateDisputeInput!): Dispute!
    updateDispute(id: ID!, input: UpdateDisputeInput!): Dispute!
    deleteDispute(id: ID!): Boolean!

    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    createOrder(input: CreateOrderInput!): CreateOrderResult!
    cancelOrder(id: ID!): Order!

    createUpgrade(input: CreateUpgradeInput!): CreateUpgradeResult!
  }

  type Subscription {
    scanUpdated(orgId: ID!): Scan!
    disputeUpdated(orgId: ID!): Dispute!
    orderUpdated(orgId: ID!): Order!
  }
`;
