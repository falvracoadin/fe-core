// rsa.service.ts

import { Injectable } from '@angular/core';
// @ts-ignore
import { environment } from "../../../environments/environment";
import { JSEncrypt } from "jsencrypt";
import * as CryptoJS from 'crypto-js';
import { DecryptionService } from "./decryption.service";

@Injectable({
  providedIn: 'root',
})
export class RsaService {
  // Load public and private keys from environment variables
  private publicKey: string = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIA359RFCja4md1NgYIKTkm+4Zb3yOmJ\ndLs2NV6aUOwOa4wZ0zAxmywsAd7WCwTehP/7onOPCO6Fu7lSLCKPh30CAwEAAQ==\n-----END PUBLIC KEY-----';
  private privateKey: string = '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAIA359RFCja4md1NgYIKTkm+4Zb3yOmJdLs2NV6aUOwOa4wZ0zAx\nmywsAd7WCwTehP/7onOPCO6Fu7lSLCKPh30CAwEAAQJAEcEsDf29a1RmoflgjJRG\nwPl4nYIURRpumpnoDACMYhNuKRLtJWSuwmks8YcX2jk+Ik62CvmFJ56BRC0zu1mQ\ngQIhANfOpppqu6xAEiaUR0l7itrdeDdnO7JHcvYSokymKkOhAiEAmBkoAmciJayM\nEPtmsB9QNoRus92J3RD7G47Ak1VRNl0CIHVaRLK307JJbRVZkKJe8hUuVc8a7hV2\nUQeK/oLb4SPBAiBVdqU1nG/ijW7yx+CujBnNWGK/7Hbf4f/HP1JUNzd3/QIhAKkI\nbet4LS8dae+mI6f3Qae2cGRoYtO1Zmv6hL419FXI\n-----END RSA PRIVATE KEY-----';
  private publicKey2048: string = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiFglM4nJomwc+/6rCm3f\n60KxX+OGA7CrUk5678Omm0NuHkP2vSdjmHKDbs70P7xWs5eGCwSUfyOzydR918zQ\n6gHxpkeBQJynupD0oDZdosEZsEY0E4wjiKIyy67NjzlXAZMDoaEO8037t+6Fe4u3\nAUZoU+4VzW9hfA2AOrg06qagLwp8QVncDp7yeYUv1e2pvRDPssD8mbTda1lVtNXR\n17e0mgENagIwIdNkahgeeUIp3XGe6VliI8O3yybqPgfJ+LnUMJYOcWhJ7r1ewD+N\ngUg36danYy/kniSKUNSLcY5tAH+uKIYvGpxvl/QW448hhwQRw/FxtIyfQrKRnXga\nTQIDAQAB\n-----END PUBLIC KEY-----';
  private privateKey2048: string = '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAiFglM4nJomwc+/6rCm3f60KxX+OGA7CrUk5678Omm0NuHkP2\nvSdjmHKDbs70P7xWs5eGCwSUfyOzydR918zQ6gHxpkeBQJynupD0oDZdosEZsEY0\nE4wjiKIyy67NjzlXAZMDoaEO8037t+6Fe4u3AUZoU+4VzW9hfA2AOrg06qagLwp8\nQVncDp7yeYUv1e2pvRDPssD8mbTda1lVtNXR17e0mgENagIwIdNkahgeeUIp3XGe\n6VliI8O3yybqPgfJ+LnUMJYOcWhJ7r1ewD+NgUg36danYy/kniSKUNSLcY5tAH+u\nKIYvGpxvl/QW448hhwQRw/FxtIyfQrKRnXgaTQIDAQABAoIBAErdq7+6/x7Soq+0\nTRLy9itmeaMfeez4y3nsYhDZq9hBlGvGAewnfsasyoLD3NZKgokmwJG4OBn/7q76\noQcoDecQnjIhvVVPL8J/6fM3Jv9BbOugAORi5PgXqDCzkWf9okrZAPt1RpJO1dNP\ng7gtJZXrpUnAx/QAHtVRTIHxuAzIE35fffpYqf5K4ZGNcrm80VO7Rze/pMkoGadb\n9AbPfNfyEh+jiQFuvVIfeGPmXXXMrPwBeFwhp9TBqoVRDtdK/IBmraZhIUz/TR7r\nfh0gOMJkfmwdWGDOMys1qPn3DSmMzxBL/s7/kWqdD8i2CXcTf/dbzc9J+pf5+3Fh\nRgHQ/DkCgYEA6coZX3j3L40koWWZE1HwTgw9yiJse2kg7MQXYtgpXBLJEDxHGRqQ\nh9oOitDqcDs6/ERTMBN7Ze+5eytJMKKmV8SMlxG+PpQUFwh7BKkabb8hKZcX1gke\nsOtvEt7zZLfYBjXFnhP+qAmL80YiVB0L+m83KenGsmru+DURJ8TvT8cCgYEAlUwf\nIwBd+e0pVVQujZM7GVtlhKcsemliDUFGnqgeqy8ttpRn9If1W7qYdKvPuZ+Sk3pt\nJwuFFyXQ2OGEFsvXc9vMu0U8+TzrwIVdIqs9RPWpj7TDFSVgsU4OSgSuaDYmDnyQ\n83JmxblyTHHgM2T5ZGTuQu43I/MB5CbZ6o58bUsCgYBexpdSpO9QT5+x7kYIFwec\nHEpQT3Q683ttgHEamRbrRJJOCqGoA6Tj7fpHPDpOFTTsX6Z5ruwvfudqjzm0hbt5\niSyVcZP2OoGKdN2qHgOgygLfoWkAU+IlRsxYkhmJkx34JoReeSybYoNhs+TmxH++\n nqd2TldGrSMDbD/wJ138sQKBgFGaOsaZ08PgYiA2k/9kAwB4GUPpUAFUinhuPlhH\n0gOFFPpfoXZhvbU2h0/1/OMbmjUrzG9z93nQfJeeo+EF56x27i9Jx+r+5mjjPCXP\n7Pw9PkHC7oInXPNsk5jXeDCTsDdo1J2L4Sqfkx6/e2j7/uhl1mkU5WSr1VPL/H4d\nBVuDAoGAZIBWavLC/LbLGBvoCFLdhoTwL+7+EJU7uL0dFrjavOWSW2LxhnA2AB5O\ncrYbHR3UhCtcoP5bVYYO1sogv1tEeWDXIMQujC7St0xX39JXdyMqdrd5bdYtSfk0\nmvWle6UKNjCyKNw6XYKSiYYORliyisC1tCuqiEng8K+Rxfm81oY=\n-----END RSA PRIVATE KEY-----';

  constructor(
    private decryptionService: DecryptionService
  ) {
    if (!this.publicKey || !this.privateKey) {
      console.error('RSA keys are not provided. Make sure to set RSA_PUBLIC_KEY and RSA_PRIVATE_KEY environment variables.');
    }
  }

  sortKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      // Bind the function to the correct context
      return obj.map(this.sortKeys.bind(this));
    }

    return Object.keys(obj)
      .sort()
      .reduce((sorted: any, key: string) => {
        const value = this.sortKeys(obj[key]);

        // Check if the value is not empty, null, or undefined
        if (value !== "" && value !== null && value !== undefined) {
          // Check if the value contains HTML tags
          const containsHtmlTags = /<\/?[a-z][\s\S]*>/i.test(value);

          if (containsHtmlTags) {
            // Convert HTML tags to Unicode escape sequence
            sorted[key] = String(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
          } else {
            sorted[key] = String(value); // Convert value to string
          }
        }

        return sorted;
      }, {});
  }

  // Function to sign a message using RSA private key
  signMessage(message: any, is_array: boolean = false) {

    console.log("message", message)

    if (is_array) {
      message = JSON.stringify(this.sortKeys(message));
    }

    console.log("message", message)

    let signer = new JSEncrypt();

    signer.setPrivateKey(this.privateKey);

    return signer.sign(message, () => CryptoJS.SHA256(message).toString(), 'sha256');
  }

  // Function to verify a signature using RSA public key
  verifySignature(message: any, signature: string, is_array: boolean = false): boolean {
    let signer = new JSEncrypt();

    if (is_array) {
      message = JSON.stringify(this.sortKeys(message));
    }

    signer.setPublicKey(this.publicKey);

    return signer.verify(message, signature, () => CryptoJS.SHA256(message).toString());
  }

  decrypt(message: any, use512: boolean = true) {
    let signer = new JSEncrypt();
    if (use512) {
      signer.setPrivateKey(this.privateKey);
    } else {
      signer.setPrivateKey(this.privateKey2048);
    }
    return signer.decrypt(message);
  }

  encrypt(message: string,  use512: boolean = true) {
    let signer = new JSEncrypt();
    if (use512) {
      signer.setPublicKey(this.publicKey);
    } else {
      signer.setPublicKey(this.publicKey2048);
    }
    return signer.encrypt(message);
  }
}
