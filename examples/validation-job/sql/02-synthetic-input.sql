-- Insert only synthetic input before sealing access for the reference workload.
-- The application/worker role has read-only access to this input in the candidate design.
INSERT INTO sample_dataset (tenant_id,dataset_id,dataset_version)
VALUES ('tenant-sample','sample-alpha',1);

INSERT INTO sample_item (tenant_id,dataset_id,dataset_version,item_no,is_valid)
VALUES ('tenant-sample','sample-alpha',1,1,true),
       ('tenant-sample','sample-alpha',1,2,false),
       ('tenant-sample','sample-alpha',1,3,true);
