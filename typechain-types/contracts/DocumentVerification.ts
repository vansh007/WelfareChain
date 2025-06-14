/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface DocumentVerificationInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "documents"
      | "getDocumentDetails"
      | "getUserDocuments"
      | "isDocumentVerified"
      | "rejectDocument"
      | "uploadDocument"
      | "userDocuments"
      | "verifyDocument"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "DocumentRejected"
      | "DocumentUploaded"
      | "DocumentVerified"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "documents",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDocumentDetails",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserDocuments",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isDocumentVerified",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rejectDocument",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uploadDocument",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "userDocuments",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyDocument",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "documents", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDocumentDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserDocuments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isDocumentVerified",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rejectDocument",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uploadDocument",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userDocuments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyDocument",
    data: BytesLike
  ): Result;
}

export namespace DocumentRejectedEvent {
  export type InputTuple = [documentId: BytesLike, verifier: AddressLike];
  export type OutputTuple = [documentId: string, verifier: string];
  export interface OutputObject {
    documentId: string;
    verifier: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DocumentUploadedEvent {
  export type InputTuple = [documentId: BytesLike, owner: AddressLike];
  export type OutputTuple = [documentId: string, owner: string];
  export interface OutputObject {
    documentId: string;
    owner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DocumentVerifiedEvent {
  export type InputTuple = [documentId: BytesLike, verifier: AddressLike];
  export type OutputTuple = [documentId: string, verifier: string];
  export interface OutputObject {
    documentId: string;
    verifier: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DocumentVerification extends BaseContract {
  connect(runner?: ContractRunner | null): DocumentVerification;
  waitForDeployment(): Promise<this>;

  interface: DocumentVerificationInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  documents: TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, string, bigint, boolean, string] & {
        documentHash: string;
        owner: string;
        timestamp: bigint;
        isVerified: boolean;
        verifiedBy: string;
      }
    ],
    "view"
  >;

  getDocumentDetails: TypedContractMethod<
    [_documentHash: BytesLike],
    [
      [string, bigint, boolean, string] & {
        owner: string;
        timestamp: bigint;
        isVerified: boolean;
        verifiedBy: string;
      }
    ],
    "view"
  >;

  getUserDocuments: TypedContractMethod<
    [_user: AddressLike],
    [string[]],
    "view"
  >;

  isDocumentVerified: TypedContractMethod<
    [_documentHash: BytesLike],
    [boolean],
    "view"
  >;

  rejectDocument: TypedContractMethod<
    [_documentHash: BytesLike],
    [void],
    "nonpayable"
  >;

  uploadDocument: TypedContractMethod<
    [_documentHash: BytesLike],
    [void],
    "nonpayable"
  >;

  userDocuments: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;

  verifyDocument: TypedContractMethod<
    [_documentHash: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "documents"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, string, bigint, boolean, string] & {
        documentHash: string;
        owner: string;
        timestamp: bigint;
        isVerified: boolean;
        verifiedBy: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getDocumentDetails"
  ): TypedContractMethod<
    [_documentHash: BytesLike],
    [
      [string, bigint, boolean, string] & {
        owner: string;
        timestamp: bigint;
        isVerified: boolean;
        verifiedBy: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getUserDocuments"
  ): TypedContractMethod<[_user: AddressLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "isDocumentVerified"
  ): TypedContractMethod<[_documentHash: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "rejectDocument"
  ): TypedContractMethod<[_documentHash: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "uploadDocument"
  ): TypedContractMethod<[_documentHash: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "userDocuments"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "verifyDocument"
  ): TypedContractMethod<[_documentHash: BytesLike], [void], "nonpayable">;

  getEvent(
    key: "DocumentRejected"
  ): TypedContractEvent<
    DocumentRejectedEvent.InputTuple,
    DocumentRejectedEvent.OutputTuple,
    DocumentRejectedEvent.OutputObject
  >;
  getEvent(
    key: "DocumentUploaded"
  ): TypedContractEvent<
    DocumentUploadedEvent.InputTuple,
    DocumentUploadedEvent.OutputTuple,
    DocumentUploadedEvent.OutputObject
  >;
  getEvent(
    key: "DocumentVerified"
  ): TypedContractEvent<
    DocumentVerifiedEvent.InputTuple,
    DocumentVerifiedEvent.OutputTuple,
    DocumentVerifiedEvent.OutputObject
  >;

  filters: {
    "DocumentRejected(bytes32,address)": TypedContractEvent<
      DocumentRejectedEvent.InputTuple,
      DocumentRejectedEvent.OutputTuple,
      DocumentRejectedEvent.OutputObject
    >;
    DocumentRejected: TypedContractEvent<
      DocumentRejectedEvent.InputTuple,
      DocumentRejectedEvent.OutputTuple,
      DocumentRejectedEvent.OutputObject
    >;

    "DocumentUploaded(bytes32,address)": TypedContractEvent<
      DocumentUploadedEvent.InputTuple,
      DocumentUploadedEvent.OutputTuple,
      DocumentUploadedEvent.OutputObject
    >;
    DocumentUploaded: TypedContractEvent<
      DocumentUploadedEvent.InputTuple,
      DocumentUploadedEvent.OutputTuple,
      DocumentUploadedEvent.OutputObject
    >;

    "DocumentVerified(bytes32,address)": TypedContractEvent<
      DocumentVerifiedEvent.InputTuple,
      DocumentVerifiedEvent.OutputTuple,
      DocumentVerifiedEvent.OutputObject
    >;
    DocumentVerified: TypedContractEvent<
      DocumentVerifiedEvent.InputTuple,
      DocumentVerifiedEvent.OutputTuple,
      DocumentVerifiedEvent.OutputObject
    >;
  };
}
